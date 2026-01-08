package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/vhvplatform/go-shared/errors"
	"github.com/vhvplatform/go-shared/logger"
	"github.com/vhvplatform/go-user-service/internal/domain"
	"github.com/vhvplatform/go-user-service/internal/middleware"
	"github.com/vhvplatform/go-user-service/internal/service"
	"go.uber.org/zap"
)

// UserHandler handles HTTP requests for users
type UserHandler struct {
	userService *service.UserService
	logger      *logger.Logger
}

// NewUserHandler creates a new user handler
func NewUserHandler(userService *service.UserService, log *logger.Logger) *UserHandler {
	return &UserHandler{
		userService: userService,
		logger:      log,
	}
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user in the system with multi-tenancy support
// @Tags users
// @Accept json
// @Produce json
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param user body domain.CreateUserRequest true "User creation request"
// @Success 201 {object} map[string]interface{} "User created successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request body"
// @Failure 409 {object} map[string]interface{} "User already exists"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/v1/users [post]
func (h *UserHandler) CreateUser(c *gin.Context) {
	var req domain.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.respondError(c, errors.BadRequest("Invalid request body"))
		return
	}

	// Override tenant ID from middleware (header takes precedence)
	req.TenantID = middleware.MustGetTenantID(c)

	userProfile, err := h.userService.CreateUser(c.Request.Context(), &req)
	if err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": h.toUserResponse(userProfile)})
}

// GetUser godoc
// @Summary Get user by ID
// @Description Get a user by their ID within a tenant
// @Tags users
// @Accept json
// @Produce json
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path string true "User ID"
// @Success 200 {object} map[string]interface{} "User details"
// @Failure 400 {object} map[string]interface{} "Invalid user ID"
// @Failure 404 {object} map[string]interface{} "User not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/v1/users/{id} [get]
func (h *UserHandler) GetUser(c *gin.Context) {
	userID := c.Param("id")
	tenantID := middleware.MustGetTenantID(c)

	userProfile, err := h.userService.GetUser(c.Request.Context(), userID, tenantID)
	if err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": h.toUserResponse(userProfile)})
}

// ListUsers godoc
// @Summary List all users
// @Description Get a paginated list of users within a tenant
// @Tags users
// @Accept json
// @Produce json
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} map[string]interface{} "List of users with pagination"
// @Failure 400 {object} map[string]interface{} "Invalid parameters"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/v1/users [get]
func (h *UserHandler) ListUsers(c *gin.Context) {
	tenantID := middleware.MustGetTenantID(c)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("itemsPerPage", "20"))

	profiles, total, err := h.userService.ListUsers(c.Request.Context(), tenantID, page, pageSize)
	if err != nil {
		h.respondError(c, err)
		return
	}

	userResponses := make([]domain.UserResponse, len(profiles))
	for i, p := range profiles {
		userResponses[i] = h.toUserResponse(p)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": domain.ListUsersResponse{
			Users:    userResponses,
			Total:    total,
			Page:     page,
			PageSize: pageSize,
		},
	})
}

// SearchUsers godoc
// @Summary Search users
// @Description Search users by query string within a tenant
// @Tags users
// @Accept json
// @Produce json
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param q query string true "Search query"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} map[string]interface{} "Search results with pagination"
// @Failure 400 {object} map[string]interface{} "Invalid parameters"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/v1/users/search [get]
func (h *UserHandler) SearchUsers(c *gin.Context) {
	tenantID := middleware.MustGetTenantID(c)
	query := c.Query("q")

	if query == "" {
		h.respondError(c, errors.BadRequest("Query parameter 'q' is required"))
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("itemsPerPage", "20"))

	profiles, total, err := h.userService.SearchUsers(c.Request.Context(), tenantID, query, page, pageSize)
	if err != nil {
		h.respondError(c, err)
		return
	}

	userResponses := make([]domain.UserResponse, len(profiles))
	for i, p := range profiles {
		userResponses[i] = h.toUserResponse(p)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": domain.ListUsersResponse{
			Users:    userResponses,
			Total:    total,
			Page:     page,
			PageSize: pageSize,
		},
	})
}

// UpdateUser godoc
// @Summary Update user
// @Description Update user information within a tenant
// @Tags users
// @Accept json
// @Produce json
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path string true "User ID"
// @Param user body domain.UpdateUserRequest true "User update request"
// @Success 200 {object} map[string]interface{} "User updated successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 404 {object} map[string]interface{} "User not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/v1/users/{id} [put]
func (h *UserHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	tenantID := middleware.MustGetTenantID(c)

	var req domain.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.respondError(c, errors.BadRequest("Invalid request body"))
		return
	}

	userProfile, err := h.userService.UpdateUser(c.Request.Context(), userID, tenantID, &req)
	if err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": h.toUserResponse(userProfile)})
}

// DeleteUser godoc
// @Summary Delete user (soft delete)
// @Description Soft delete a user within a tenant
// @Tags users
// @Accept json
// @Produce json
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path string true "User ID"
// @Success 200 {object} map[string]interface{} "User deleted successfully"
// @Failure 400 {object} map[string]interface{} "Invalid user ID"
// @Failure 404 {object} map[string]interface{} "User not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/v1/users/{id} [delete]
func (h *UserHandler) DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	tenantID := middleware.MustGetTenantID(c)

	if err := h.userService.DeleteUser(c.Request.Context(), userID, tenantID); err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// toUserResponse converts a user domain model to a response
func (h *UserHandler) toUserResponse(profile *domain.UserProfile) domain.UserResponse {
	return domain.UserResponse{
		ID:        profile.User.ID.Hex(),
		Email:     profile.User.Email,
		TenantID:  profile.UserTenant.TenantID,
		FirstName: profile.UserTenant.FirstName,
		LastName:  profile.UserTenant.LastName,
		Phone:     profile.User.Phone,
		AvatarURL: profile.User.AvatarURL,
		IsActive:  profile.User.IsActive && profile.UserTenant.IsActive, // Both must be active? Or just Tenant?
		CreatedAt: profile.User.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: profile.User.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// respondError responds with an error
func (h *UserHandler) respondError(c *gin.Context, err error) {
	appErr := errors.FromError(err)
	h.logger.Error("Request failed",
		zap.String("path", c.Request.URL.Path),
		zap.String("method", c.Request.Method),
		zap.String("error", appErr.Message),
	)
	c.JSON(appErr.StatusCode, gin.H{"error": appErr})
}
