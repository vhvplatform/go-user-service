package grpc

import (
	"github.com/longvhv/saas-framework-go/pkg/logger"
	"github.com/longvhv/saas-framework-go/services/user-service/internal/service"
	// pb "github.com/longvhv/saas-framework-go/services/user-service/proto"
)

// UserServiceServer implements the gRPC user service
type UserServiceServer struct {
	// pb.UnimplementedUserServiceServer
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

/*
// GetUser retrieves a user by ID
func (s *UserServiceServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
	user, err := s.userService.GetUser(ctx, req.UserId, req.TenantId)
	if err != nil {
		s.logger.Error("Failed to get user", zap.Error(err))
		return nil, err
	}
	
	return &pb.GetUserResponse{
		User: s.toProtoUser(user),
	}, nil
}

// ListUsers lists users for a tenant
func (s *UserServiceServer) ListUsers(ctx context.Context, req *pb.ListUsersRequest) (*pb.ListUsersResponse, error) {
	page := int(req.Page)
	pageSize := int(req.PageSize)
	
	users, total, err := s.userService.ListUsers(ctx, req.TenantId, page, pageSize)
	if err != nil {
		s.logger.Error("Failed to list users", zap.Error(err))
		return nil, err
	}
	
	protoUsers := make([]*pb.User, len(users))
	for i, user := range users {
		protoUsers[i] = s.toProtoUser(user)
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
	
	user, err := s.userService.UpdateUser(ctx, req.UserId, req.TenantId, updateReq)
	if err != nil {
		s.logger.Error("Failed to update user", zap.Error(err))
		return nil, err
	}
	
	return &pb.UpdateUserResponse{
		User: s.toProtoUser(user),
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
	
	users, total, err := s.userService.SearchUsers(ctx, req.TenantId, req.Query, page, pageSize)
	if err != nil {
		s.logger.Error("Failed to search users", zap.Error(err))
		return nil, err
	}
	
	protoUsers := make([]*pb.User, len(users))
	for i, user := range users {
		protoUsers[i] = s.toProtoUser(user)
	}
	
	return &pb.SearchUsersResponse{
		Users: protoUsers,
		Total: int32(total),
	}, nil
}

func (s *UserServiceServer) toProtoUser(user *domain.User) *pb.User {
	return &pb.User{
		Id:        user.ID.Hex(),
		Email:     user.Email,
		TenantId:  user.TenantID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Phone:     user.Phone,
		AvatarUrl: user.AvatarURL,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
		UpdatedAt: user.UpdatedAt.Format(time.RFC3339),
	}
}
*/
