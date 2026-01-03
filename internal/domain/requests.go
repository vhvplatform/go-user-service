package domain

// CreateUserRequest represents a user creation request
type CreateUserRequest struct {
	Email     string `json:"email" binding:"required,email"`
	TenantID  string `json:"tenant_id"` // Injected from X-Tenant-ID header by middleware
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
}

// UpdateUserRequest represents a user update request
type UpdateUserRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	AvatarURL string `json:"avatar_url"`
}

// ListUsersRequest represents a list users request
type ListUsersRequest struct {
	TenantID string `form:"tenant_id"`
	Page     int    `form:"page"`
	PageSize int    `form:"itemsPerPage"`
}

// SearchUsersRequest represents a search users request
type SearchUsersRequest struct {
	TenantID string `form:"tenant_id" binding:"required"`
	Query    string `form:"q" binding:"required"`
	Page     int    `form:"page"`
	PageSize int    `form:"itemsPerPage"`
}

// UserResponse represents a user in API responses
type UserResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	TenantID  string `json:"tenant_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone,omitempty"`
	AvatarURL string `json:"avatar_url,omitempty"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// ListUsersResponse represents a paginated list of users
type ListUsersResponse struct {
	Users    []UserResponse `json:"users"`
	Total    int64          `json:"total"`
	Page     int            `json:"page"`
	PageSize int            `json:"itemsPerPage"`
}
