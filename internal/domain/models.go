package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user profile in the system
type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	TenantID  string             `bson:"tenant_id" json:"tenant_id"`
	FirstName string             `bson:"first_name" json:"first_name"`
	LastName  string             `bson:"last_name" json:"last_name"`
	Phone     string             `bson:"phone,omitempty" json:"phone,omitempty"`
	AvatarURL string             `bson:"avatar_url,omitempty" json:"avatar_url,omitempty"`
	IsActive  bool               `bson:"is_active" json:"is_active"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// UserPreferences represents user preferences
type UserPreferences struct {
	ID       primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	UserID   string                 `bson:"user_id" json:"user_id"`
	TenantID string                 `bson:"tenant_id" json:"tenant_id"`
	Language string                 `bson:"language" json:"language"`
	Timezone string                 `bson:"timezone" json:"timezone"`
	Theme    string                 `bson:"theme" json:"theme"`
	Settings map[string]interface{} `bson:"settings,omitempty" json:"settings,omitempty"`
}
