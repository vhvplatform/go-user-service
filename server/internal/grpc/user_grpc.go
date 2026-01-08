package grpc

import (
	"context"
	"time"

	"github.com/vhvplatform/go-shared/logger"
	"github.com/vhvplatform/go-user-service/internal/domain"
	"github.com/vhvplatform/go-user-service/internal/service"
	pb "github.com/vhvplatform/go-user-service/proto"
	"go.uber.org/zap"
)

// UserServiceServer implements the gRPC user service
type UserServiceServer struct {
	pb.UnimplementedUserServiceServer
	userService *service.UserService
	logger      *logger.Logger
}

// NewUserServiceServer creates a new gRPC user service server
func NewUserServiceServer(userService *service.UserService, log *logger.Logger) *UserServiceServer {
	return &UserServiceServer{
		userService: userService,
		logger:      log,
	}
}

// Note: gRPC methods are commented out until protobuf code is generated
// Run `make proto` to generate the protobuf code, then uncomment the methods below

// GetUser retrieves a user by ID
func (s *UserServiceServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
	userProfile, err := s.userService.GetUser(ctx, req.UserId, req.TenantId)
	if err != nil {
		s.logger.Error("Failed to get user", zap.Error(err))
		return nil, err
	}

	return &pb.GetUserResponse{
		User: s.toProtoUser(userProfile),
	}, nil
}

// ListUsers lists users for a tenant
func (s *UserServiceServer) ListUsers(ctx context.Context, req *pb.ListUsersRequest) (*pb.ListUsersResponse, error) {
	page := int(req.Page)
	pageSize := int(req.PageSize)

	profiles, total, err := s.userService.ListUsers(ctx, req.TenantId, page, pageSize)
	if err != nil {
		s.logger.Error("Failed to list users", zap.Error(err))
		return nil, err
	}

	protoUsers := make([]*pb.User, len(profiles))
	for i, p := range profiles {
		protoUsers[i] = s.toProtoUser(p)
	}

	return &pb.ListUsersResponse{
		Users:    protoUsers,
		Total:    int32(total),
		Page:     req.Page,
		PageSize: req.PageSize,
	}, nil
}

// UpdateUser updates a user
func (s *UserServiceServer) UpdateUser(ctx context.Context, req *pb.UpdateUserRequest) (*pb.UpdateUserResponse, error) {
	updateReq := &domain.UpdateUserRequest{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
		AvatarURL: req.AvatarUrl,
	}

	userProfile, err := s.userService.UpdateUser(ctx, req.UserId, req.TenantId, updateReq)
	if err != nil {
		s.logger.Error("Failed to update user", zap.Error(err))
		return nil, err
	}

	return &pb.UpdateUserResponse{
		User: s.toProtoUser(userProfile),
	}, nil
}

// DeleteUser deletes a user
func (s *UserServiceServer) DeleteUser(ctx context.Context, req *pb.DeleteUserRequest) (*pb.DeleteUserResponse, error) {
	err := s.userService.DeleteUser(ctx, req.UserId, req.TenantId)
	if err != nil {
		s.logger.Error("Failed to delete user", zap.Error(err))
		return nil, err
	}

	return &pb.DeleteUserResponse{
		Success: true,
	}, nil
}

// SearchUsers searches users by query
func (s *UserServiceServer) SearchUsers(ctx context.Context, req *pb.SearchUsersRequest) (*pb.SearchUsersResponse, error) {
	page := int(req.Page)
	pageSize := int(req.PageSize)

	profiles, total, err := s.userService.SearchUsers(ctx, req.TenantId, req.Query, page, pageSize)
	if err != nil {
		s.logger.Error("Failed to search users", zap.Error(err))
		return nil, err
	}

	protoUsers := make([]*pb.User, len(profiles))
	for i, p := range profiles {
		protoUsers[i] = s.toProtoUser(p)
	}

	return &pb.SearchUsersResponse{
		Users: protoUsers,
		Total: int32(total),
	}, nil
}

// VerifyToken verifies an opaque token (Mock implementation for now)
func (s *UserServiceServer) VerifyToken(ctx context.Context, req *pb.VerifyTokenRequest) (*pb.VerifyTokenResponse, error) {
	// TODO: Implement actual opaque token verification logic (check DB/Redis)
	// For now, we assume if the token is "valid-token", it's valid.
	if req.Token == "valid-token" {
		return &pb.VerifyTokenResponse{
			Valid:     true,
			UserId:    "mock-user-id",
			TenantIds: []string{req.TenantId},
			Role:      "user",
			Claims:    map[string]string{"scope": "read"},
		}, nil
	}
	return &pb.VerifyTokenResponse{Valid: false}, nil
}

func (s *UserServiceServer) toProtoUser(p *domain.UserProfile) *pb.User {
	return &pb.User{
		Id:        p.User.ID.Hex(),
		Email:     p.User.Email,
		TenantId:  p.UserTenant.TenantID,
		FirstName: p.UserTenant.FirstName,
		LastName:  p.UserTenant.LastName,
		Phone:     p.User.Phone,
		AvatarUrl: p.User.AvatarURL,
		IsActive:  p.User.IsActive && p.UserTenant.IsActive,
		CreatedAt: p.User.CreatedAt.Format(time.RFC3339),
		UpdatedAt: p.User.UpdatedAt.Format(time.RFC3339),
	}
}
