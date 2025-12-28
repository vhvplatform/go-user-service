package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user profile in the system
type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	TenantID  string             `bson:"tenantId" json:"tenant_id"`
	FirstName string             `bson:"firstName" json:"first_name"`
	LastName  string             `bson:"lastName" json:"last_name"`
	Phone     string             `bson:"phone,omitempty" json:"phone,omitempty"`
	AvatarURL string             `bson:"avatarUrl,omitempty" json:"avatar_url,omitempty"`
	IsActive  bool               `bson:"isActive" json:"is_active"`
	CreatedAt time.Time          `bson:"createdAt" json:"created_at"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updated_at"`
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
