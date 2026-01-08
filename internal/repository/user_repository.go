package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/vhvplatform/go-user-service/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// UserRepository handles user data access
type UserRepository struct {
	users       *mongo.Collection
	userTenants *mongo.Collection
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *mongo.Database) *UserRepository {
	users := db.Collection("users")
	userTenants := db.Collection("user_tenants")

	// Create indexes
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userIndexes := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	}
	_, _ = users.Indexes().CreateMany(ctx, userIndexes)

	tenantIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "userId", Value: 1},
				{Key: "tenantId", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		},
		{Keys: bson.D{{Key: "tenantId", Value: 1}}},
		{
			Keys: bson.D{
				{Key: "firstName", Value: "text"},
				{Key: "lastName", Value: "text"},
			},
		},
	}
	_, _ = userTenants.Indexes().CreateMany(ctx, tenantIndexes)

	return &UserRepository{
		users:       users,
		userTenants: userTenants,
	}
}

// Create transactionally creates a user and tenant association
// Note: MongoDB transactions require replica set. Assuming support or using best-effort.
// Implementation here uses independent creates for simplicity in this environment.
func (r *UserRepository) Create(ctx context.Context, user *domain.User, userTenant *domain.UserTenant) error {
	// 1. Upsert User (Global)
	// We check if user exists by email. If so, use existing ID.
	filter := bson.M{"email": user.Email}
	update := bson.M{
		"$setOnInsert": bson.M{
			"email":     user.Email,
			"phone":     user.Phone,
			"avatarUrl": user.AvatarURL,
			"isActive":  user.IsActive,
			"createdAt": time.Now(),
		},
		"$set": bson.M{"updatedAt": time.Now()},
	}
	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)

	var savedUser domain.User
	err := r.users.FindOneAndUpdate(ctx, filter, update, opts).Decode(&savedUser)
	if err != nil {
		return fmt.Errorf("failed to upsert user: %w", err)
	}

	// Update input user with ID
	user.ID = savedUser.ID
	userTenant.UserID = savedUser.ID
	userTenant.JoinedAt = time.Now()

	// 2. Insert UserTenant
	_, err = r.userTenants.InsertOne(ctx, userTenant)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return fmt.Errorf("user already in tenant")
		}
		return fmt.Errorf("failed to create user tenant link: %w", err)
	}

	return nil
}

// UserWithTenant is a helper struct for aggregation results
type UserWithTenant struct {
	User       domain.User       `bson:"user"`
	UserTenant domain.UserTenant `bson:",inline"`
}

// FindByID finds a user by ID and tenant
func (r *UserRepository) FindByID(ctx context.Context, id, tenantID string) (*domain.User, *domain.UserTenant, error) {
	userID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid user ID: %w", err)
	}

	// Find Tenant Link
	var ut domain.UserTenant
	err = r.userTenants.FindOne(ctx, bson.M{"userId": userID, "tenantId": tenantID}).Decode(&ut)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil, nil
		}
		return nil, nil, fmt.Errorf("failed to find user tenant: %w", err)
	}

	// Find User
	var u domain.User
	err = r.users.FindOne(ctx, bson.M{"_id": userID}).Decode(&u)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to find user: %w", err)
	}

	return &u, &ut, nil
}

// FindByEmail finds a user by email and retrieves their tenant info
func (r *UserRepository) FindByEmail(ctx context.Context, email, tenantID string) (*domain.User, *domain.UserTenant, error) {
	// 1. Find User by Email
	var u domain.User
	err := r.users.FindOne(ctx, bson.M{"email": email}).Decode(&u)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil, nil
		}
		return nil, nil, fmt.Errorf("failed to find user by email: %w", err)
	}

	// 2. Find Tenant Link
	var ut domain.UserTenant
	err = r.userTenants.FindOne(ctx, bson.M{"userId": u.ID, "tenantId": tenantID}).Decode(&ut)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// User exists but not in this tenant
			return &u, nil, nil
		}
		return nil, nil, fmt.Errorf("failed to find user tenant: %w", err)
	}

	return &u, &ut, nil
}

// List lists users for a tenant with pagination
func (r *UserRepository) List(ctx context.Context, tenantID string, page, pageSize int) ([]*UserWithTenant, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	skip := (page - 1) * pageSize

	// Count on UserTenant
	total, err := r.userTenants.CountDocuments(ctx, bson.M{"tenantId": tenantID})
	if err != nil {
		return nil, 0, err
	}

	// Aggregation to join Users
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{"tenantId": tenantID}}},
		{{Key: "$sort", Value: bson.M{"joinedAt": -1}}},
		{{Key: "$skip", Value: int64(skip)}},
		{{Key: "$limit", Value: int64(pageSize)}},
		{{Key: "$lookup", Value: bson.M{
			"from":         "users",
			"localField":   "userId",
			"foreignField": "_id",
			"as":           "user_docs",
		}}},
		{{Key: "$unwind", Value: "$user_docs"}},
		{{Key: "$project", Value: bson.M{
			"user":   "$user_docs",
			"userId": 1, "tenantId": 1, "roles": 1, "firstName": 1, "lastName": 1, "isActive": 1, "joinedAt": 1,
		}}},
	}

	cursor, err := r.userTenants.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var results []*UserWithTenant
	if err := cursor.All(ctx, &results); err != nil {
		return nil, 0, err
	}

	return results, total, nil
}

// Update updates user and tenant info
func (r *UserRepository) Update(ctx context.Context, user *domain.User, userTenant *domain.UserTenant) error {
	// Update User
	if user != nil {
		user.UpdatedAt = time.Now()
		_, err := r.users.UpdateOne(ctx, bson.M{"_id": user.ID}, bson.M{"$set": user})
		if err != nil {
			return err
		}
	}

	// Update UserTenant
	if userTenant != nil {
		_, err := r.userTenants.UpdateOne(ctx,
			bson.M{"userId": userTenant.UserID, "tenantId": userTenant.TenantID},
			bson.M{"$set": userTenant},
		)
		if err != nil {
			return err
		}
	}
	return nil
}

// Delete soft deletes a user from a tenant
func (r *UserRepository) Delete(ctx context.Context, id, tenantID string) error {
	userID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.userTenants.UpdateOne(ctx,
		bson.M{"userId": userID, "tenantId": tenantID},
		bson.M{"$set": bson.M{"isActive": false}},
	)
	return err
}

// Search searches users
func (r *UserRepository) Search(ctx context.Context, tenantID, query string, page, pageSize int) ([]*UserWithTenant, int64, error) {
	skip := (page - 1) * pageSize

	// Search in UserTenant (firstName, lastName)
	match := bson.M{
		"tenantId": tenantID,
		"$text":    bson.M{"$search": query},
	}

	// Count
	total, err := r.userTenants.CountDocuments(ctx, match)
	if err != nil {
		return nil, 0, err
	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: match}},
		{{Key: "$skip", Value: int64(skip)}},
		{{Key: "$limit", Value: int64(pageSize)}},
		{{Key: "$lookup", Value: bson.M{
			"from":         "users",
			"localField":   "userId",
			"foreignField": "_id",
			"as":           "user_docs",
		}}},
		{{Key: "$unwind", Value: "$user_docs"}},
		{{Key: "$project", Value: bson.M{
			"user":   "$user_docs",
			"userId": 1, "tenantId": 1, "roles": 1, "firstName": 1, "lastName": 1, "isActive": 1, "joinedAt": 1,
		}}},
	}

	cursor, err := r.userTenants.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var results []*UserWithTenant
	if err := cursor.All(ctx, &results); err != nil {
		return nil, 0, err
	}

	return results, total, nil
}
