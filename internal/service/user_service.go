package service

import (
	"context"
	"fmt"

	"github.com/longvhv/saas-framework-go/pkg/errors"
	"github.com/longvhv/saas-framework-go/pkg/logger"
	"github.com/longvhv/saas-framework-go/services/user-service/internal/domain"
	"github.com/longvhv/saas-framework-go/services/user-service/internal/repository"
	"go.uber.org/zap"
)

// UserService handles user business logic
type UserService struct {
	userRepo *repository.UserRepository
	logger   *logger.Logger
}

// NewUserService creates a new user service
func NewUserService(userRepo *repository.UserRepository, log *logger.Logger) *UserService {
	return &UserService{
		userRepo: userRepo,
		logger:   log,
	}
}

// CreateUser creates a new user
func (s *UserService) CreateUser(ctx context.Context, req *domain.CreateUserRequest) (*domain.User, error) {
	// Check if user already exists
	existingUser, err := s.userRepo.FindByEmail(ctx, req.Email, req.TenantID)
	if err != nil {
		s.logger.Error("Failed to check existing user", zap.Error(err))
		return nil, errors.Internal("Failed to create user")
	}
	if existingUser != nil {
		return nil, errors.Conflict("User already exists with this email")
	}
	
	// Create user
	user := &domain.User{
		Email:     req.Email,
		TenantID:  req.TenantID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
		IsActive:  true,
	}
	
	if err := s.userRepo.Create(ctx, user); err != nil {
		s.logger.Error("Failed to create user", zap.Error(err))
		return nil, errors.Internal("Failed to create user")
	}
	
	s.logger.Info("User created successfully", 
		zap.String("user_id", user.ID.Hex()),
		zap.String("email", user.Email),
		zap.String("tenant_id", user.TenantID),
	)
	
	return user, nil
}

// GetUser retrieves a user by ID
func (s *UserService) GetUser(ctx context.Context, id, tenantID string) (*domain.User, error) {
	user, err := s.userRepo.FindByID(ctx, id, tenantID)
	if err != nil {
		s.logger.Error("Failed to get user", zap.String("user_id", id), zap.Error(err))
		return nil, errors.Internal("Failed to get user")
	}
	if user == nil {
		return nil, errors.NotFound("User not found")
	}
	return user, nil
}

// ListUsers lists users for a tenant with pagination
func (s *UserService) ListUsers(ctx context.Context, tenantID string, page, pageSize int) ([]*domain.User, int64, error) {
	users, total, err := s.userRepo.List(ctx, tenantID, page, pageSize)
	if err != nil {
		s.logger.Error("Failed to list users", zap.Error(err))
		return nil, 0, errors.Internal("Failed to list users")
	}
	return users, total, nil
}

// SearchUsers searches users by query
func (s *UserService) SearchUsers(ctx context.Context, tenantID, query string, page, pageSize int) ([]*domain.User, int64, error) {
	users, total, err := s.userRepo.Search(ctx, tenantID, query, page, pageSize)
	if err != nil {
		s.logger.Error("Failed to search users", zap.Error(err))
		return nil, 0, errors.Internal("Failed to search users")
	}
	return users, total, nil
}

// UpdateUser updates a user
func (s *UserService) UpdateUser(ctx context.Context, id, tenantID string, req *domain.UpdateUserRequest) (*domain.User, error) {
	// Get existing user
	user, err := s.userRepo.FindByID(ctx, id, tenantID)
	if err != nil {
		s.logger.Error("Failed to find user", zap.Error(err))
		return nil, errors.Internal("Failed to update user")
	}
	if user == nil {
		return nil, errors.NotFound("User not found")
	}
	
	// Update fields
	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.AvatarURL != "" {
		user.AvatarURL = req.AvatarURL
	}
	
	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to update user", zap.Error(err))
		return nil, errors.Internal("Failed to update user")
	}
	
	s.logger.Info("User updated successfully", 
		zap.String("user_id", user.ID.Hex()),
	)
	
	return user, nil
}

// DeleteUser deletes a user
func (s *UserService) DeleteUser(ctx context.Context, id, tenantID string) error {
	// Check if user exists
	user, err := s.userRepo.FindByID(ctx, id, tenantID)
	if err != nil {
		s.logger.Error("Failed to find user", zap.Error(err))
		return errors.Internal("Failed to delete user")
	}
	if user == nil {
		return errors.NotFound("User not found")
	}
	
	if err := s.userRepo.Delete(ctx, id, tenantID); err != nil {
		s.logger.Error("Failed to delete user", zap.Error(err))
		return errors.Internal("Failed to delete user")
	}
	
	s.logger.Info("User deleted successfully", 
		zap.String("user_id", id),
	)
	
	return nil
}
