package proto

import (
	"context"

	"google.golang.org/grpc"
)

// This file is a TEMPORARY STUB to allow compilation without running protoc.
// It matches the expected output of proper protobuf generation.

type User struct {
	Id        string `json:"id,omitempty"`
	Email     string `json:"email,omitempty"`
	TenantId  string `json:"tenant_id,omitempty"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Phone     string `json:"phone,omitempty"`
	AvatarUrl string `json:"avatar_url,omitempty"`
	IsActive  bool   `json:"is_active,omitempty"`
	CreatedAt string `json:"created_at,omitempty"`
	UpdatedAt string `json:"updated_at,omitempty"`
}

type GetUserRequest struct {
	UserId   string `json:"user_id,omitempty"`
	TenantId string `json:"tenant_id,omitempty"`
}

type GetUserResponse struct {
	User *User `json:"user,omitempty"`
}

type ListUsersRequest struct {
	TenantId string `json:"tenant_id,omitempty"`
	Page     int32  `json:"page,omitempty"`
	PageSize int32  `json:"page_size,omitempty"`
}

type ListUsersResponse struct {
	Users    []*User `json:"users,omitempty"`
	Total    int32   `json:"total,omitempty"`
	Page     int32   `json:"page,omitempty"`
	PageSize int32   `json:"page_size,omitempty"`
}

type UpdateUserRequest struct {
	UserId    string `json:"user_id,omitempty"`
	TenantId  string `json:"tenant_id,omitempty"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Phone     string `json:"phone,omitempty"`
	AvatarUrl string `json:"avatar_url,omitempty"`
}

type UpdateUserResponse struct {
	User *User `json:"user,omitempty"`
}

type DeleteUserRequest struct {
	UserId   string `json:"user_id,omitempty"`
	TenantId string `json:"tenant_id,omitempty"`
}

type DeleteUserResponse struct {
	Success bool `json:"success,omitempty"`
}

type SearchUsersRequest struct {
	TenantId string `json:"tenant_id,omitempty"`
	Query    string `json:"query,omitempty"`
	Page     int32  `json:"page,omitempty"`
	PageSize int32  `json:"page_size,omitempty"`
}

type SearchUsersResponse struct {
	Users []*User `json:"users,omitempty"`
	Total int32   `json:"total,omitempty"`
}

type VerifyTokenRequest struct {
	Token    string `json:"token,omitempty"`
	TenantId string `json:"tenant_id,omitempty"`
}

type VerifyTokenResponse struct {
	Valid     bool              `json:"valid,omitempty"`
	UserId    string            `json:"user_id,omitempty"`
	TenantIds []string          `json:"tenant_ids,omitempty"`
	Role      string            `json:"role,omitempty"`
	Claims    map[string]string `json:"claims,omitempty"`
}

// Client Interface
type UserServiceClient interface {
	GetUser(ctx context.Context, in *GetUserRequest, opts ...grpc.CallOption) (*GetUserResponse, error)
	ListUsers(ctx context.Context, in *ListUsersRequest, opts ...grpc.CallOption) (*ListUsersResponse, error)
	UpdateUser(ctx context.Context, in *UpdateUserRequest, opts ...grpc.CallOption) (*UpdateUserResponse, error)
	DeleteUser(ctx context.Context, in *DeleteUserRequest, opts ...grpc.CallOption) (*DeleteUserResponse, error)
	SearchUsers(ctx context.Context, in *SearchUsersRequest, opts ...grpc.CallOption) (*SearchUsersResponse, error)
	VerifyToken(ctx context.Context, in *VerifyTokenRequest, opts ...grpc.CallOption) (*VerifyTokenResponse, error)
}

type userServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewUserServiceClient(cc grpc.ClientConnInterface) UserServiceClient {
	return &userServiceClient{cc}
}

func (c *userServiceClient) GetUser(ctx context.Context, in *GetUserRequest, opts ...grpc.CallOption) (*GetUserResponse, error) {
	out := new(GetUserResponse)
	err := c.cc.Invoke(ctx, "/user.UserService/GetUser", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}
func (c *userServiceClient) ListUsers(ctx context.Context, in *ListUsersRequest, opts ...grpc.CallOption) (*ListUsersResponse, error) {
	out := new(ListUsersResponse)
	err := c.cc.Invoke(ctx, "/user.UserService/ListUsers", in, out, opts...)
	return out, err
}
func (c *userServiceClient) UpdateUser(ctx context.Context, in *UpdateUserRequest, opts ...grpc.CallOption) (*UpdateUserResponse, error) {
	out := new(UpdateUserResponse)
	err := c.cc.Invoke(ctx, "/user.UserService/UpdateUser", in, out, opts...)
	return out, err
}
func (c *userServiceClient) DeleteUser(ctx context.Context, in *DeleteUserRequest, opts ...grpc.CallOption) (*DeleteUserResponse, error) {
	out := new(DeleteUserResponse)
	err := c.cc.Invoke(ctx, "/user.UserService/DeleteUser", in, out, opts...)
	return out, err
}
func (c *userServiceClient) SearchUsers(ctx context.Context, in *SearchUsersRequest, opts ...grpc.CallOption) (*SearchUsersResponse, error) {
	out := new(SearchUsersResponse)
	err := c.cc.Invoke(ctx, "/user.UserService/SearchUsers", in, out, opts...)
	return out, err
}
func (c *userServiceClient) VerifyToken(ctx context.Context, in *VerifyTokenRequest, opts ...grpc.CallOption) (*VerifyTokenResponse, error) {
	out := new(VerifyTokenResponse)
	err := c.cc.Invoke(ctx, "/user.UserService/VerifyToken", in, out, opts...)
	return out, err
}

// Server Interface
type UserServiceServer interface {
	GetUser(context.Context, *GetUserRequest) (*GetUserResponse, error)
	ListUsers(context.Context, *ListUsersRequest) (*ListUsersResponse, error)
	UpdateUser(context.Context, *UpdateUserRequest) (*UpdateUserResponse, error)
	DeleteUser(context.Context, *DeleteUserRequest) (*DeleteUserResponse, error)
	SearchUsers(context.Context, *SearchUsersRequest) (*SearchUsersResponse, error)
	VerifyToken(context.Context, *VerifyTokenRequest) (*VerifyTokenResponse, error)
	mustEmbedUnimplementedUserServiceServer()
}

type UnimplementedUserServiceServer struct{}

func (UnimplementedUserServiceServer) GetUser(context.Context, *GetUserRequest) (*GetUserResponse, error) {
	return nil, nil
}
func (UnimplementedUserServiceServer) ListUsers(context.Context, *ListUsersRequest) (*ListUsersResponse, error) {
	return nil, nil
}
func (UnimplementedUserServiceServer) UpdateUser(context.Context, *UpdateUserRequest) (*UpdateUserResponse, error) {
	return nil, nil
}
func (UnimplementedUserServiceServer) DeleteUser(context.Context, *DeleteUserRequest) (*DeleteUserResponse, error) {
	return nil, nil
}
func (UnimplementedUserServiceServer) SearchUsers(context.Context, *SearchUsersRequest) (*SearchUsersResponse, error) {
	return nil, nil
}
func (UnimplementedUserServiceServer) VerifyToken(context.Context, *VerifyTokenRequest) (*VerifyTokenResponse, error) {
	return nil, nil
}
func (UnimplementedUserServiceServer) mustEmbedUnimplementedUserServiceServer() {}

func RegisterUserServiceServer(s grpc.ServiceRegistrar, srv UserServiceServer) {
	s.RegisterService(&grpc.ServiceDesc{
		ServiceName: "user.UserService",
		HandlerType: (*UserServiceServer)(nil),
		Methods: []grpc.MethodDesc{
			{MethodName: "GetUser", Handler: nil}, // Handlers omitted for brevity in stub
			{MethodName: "VerifyToken", Handler: nil},
		},
		Streams:  []grpc.StreamDesc{},
		Metadata: "user.proto",
	}, srv)
}
