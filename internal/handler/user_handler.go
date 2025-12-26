package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/vhvplatform/go-shared/errors"
	"github.com/vhvplatform/go-shared/logger"
	"github.com/vhvplatform/go-user-service/internal/domain"
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

// CreateUser handles user creation
func (h *UserHandler) CreateUser(c *gin.Context) {
	var req domain.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.respondError(c, errors.BadRequest("Invalid request body"))
		return
	}

	user, err := h.userService.CreateUser(c.Request.Context(), &req)
	if err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": h.toUserResponse(user)})
}

// GetUser handles getting a user by ID
func (h *UserHandler) GetUser(c *gin.Context) {
	userID := c.Param("id")
	tenantID := c.GetString("tenant_id")

	user, err := h.userService.GetUser(c.Request.Context(), userID, tenantID)
	if err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": h.toUserResponse(user)})
}

// ListUsers handles listing users
func (h *UserHandler) ListUsers(c *gin.Context) {
	tenantID := c.GetString("tenant_id")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	users, total, err := h.userService.ListUsers(c.Request.Context(), tenantID, page, pageSize)
	if err != nil {
		h.respondError(c, err)
		return
	}

	userResponses := make([]domain.UserResponse, len(users))
	for i, user := range users {
		userResponses[i] = h.toUserResponse(user)
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

// SearchUsers handles searching users
func (h *UserHandler) SearchUsers(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	query := c.Query("q")

	if query == "" {
		h.respondError(c, errors.BadRequest("Query parameter 'q' is required"))
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	users, total, err := h.userService.SearchUsers(c.Request.Context(), tenantID, query, page, pageSize)
	if err != nil {
		h.respondError(c, err)
		return
	}

	userResponses := make([]domain.UserResponse, len(users))
	for i, user := range users {
		userResponses[i] = h.toUserResponse(user)
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

// UpdateUser handles updating a user
func (h *UserHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	tenantID := c.GetString("tenant_id")

	var req domain.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.respondError(c, errors.BadRequest("Invalid request body"))
		return
	}

	user, err := h.userService.UpdateUser(c.Request.Context(), userID, tenantID, &req)
	if err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": h.toUserResponse(user)})
}

// DeleteUser handles deleting a user
func (h *UserHandler) DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.userService.DeleteUser(c.Request.Context(), userID, tenantID); err != nil {
		h.respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// toUserResponse converts a user domain model to a response
func (h *UserHandler) toUserResponse(user *domain.User) domain.UserResponse {
	return domain.UserResponse{
		ID:        user.ID.Hex(),
		Email:     user.Email,
		TenantID:  user.TenantID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Phone:     user.Phone,
		AvatarURL: user.AvatarURL,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: user.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
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
