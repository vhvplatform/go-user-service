package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a global user identity
type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email        string             `bson:"email" json:"email"`
	PasswordHash string             `bson:"passwordHash,omitempty" json:"-"`
	Phone        string             `bson:"phone,omitempty" json:"phone,omitempty"`
	AvatarURL    string             `bson:"avatarUrl,omitempty" json:"avatar_url,omitempty"`
	IsActive     bool               `bson:"isActive" json:"is_active"`
	CreatedAt    time.Time          `bson:"createdAt" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updatedAt" json:"updated_at"`
}

// UserTenant represents the association between a user and a tenant
type UserTenant struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"userId" json:"user_id"`
	TenantID  string             `bson:"tenantId" json:"tenant_id"`
	Roles     []string           `bson:"roles" json:"roles"`
	FirstName string             `bson:"firstName,omitempty" json:"first_name"`
	LastName  string             `bson:"lastName,omitempty" json:"last_name"`
	IsActive  bool               `bson:"isActive" json:"is_active"`
	JoinedAt  time.Time          `bson:"joinedAt" json:"joined_at"`
}

// UserProfile represents the combined view of a user and their tenant context
type UserProfile struct {
	User       *User
	UserTenant *UserTenant
}

// UserPreferences represents user preferences
type UserPreferences struct {
	ID       primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	UserID   string                 `bson:"userId" json:"user_id"`
	TenantID string                 `bson:"tenantId" json:"tenant_id"`
	Language string                 `bson:"language" json:"language"`
	Timezone string                 `bson:"timezone" json:"timezone"`
	Theme    string                 `bson:"theme" json:"theme"`
	Settings map[string]interface{} `bson:"settings,omitempty" json:"settings,omitempty"`
}
