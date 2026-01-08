# 🚀 Golang API Structure - VHV Platform

## 📁 Project Structure

```
go-user-service/
├── cmd/
│   └── api/
│       └── main.go                    # Entry point
│
├── internal/
│   ├── models/                        # Data models
│   │   ├── user.go
│   │   ├── role.go
│   │   ├── permission.go
│   │   └── session.go
│   │
│   ├── repositories/                  # Database layer
│   │   ├── user_repository.go
│   │   ├── role_repository.go
│   │   ├── permission_repository.go
│   │   └── session_repository.go
│   │
│   ├── services/                      # Business logic
│   │   ├── user_service.go
│   │   ├── auth_service.go
│   │   ├── role_service.go
│   │   └── permission_service.go
│   │
│   ├── handlers/                      # HTTP handlers
│   │   ├── user_handler.go
│   │   ├── auth_handler.go
│   │   ├── role_handler.go
│   │   └── health_handler.go
│   │
│   ├── middleware/                    # Middleware
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── logger.go
│   │   ├── rate_limit.go
│   │   └── recovery.go
│   │
│   ├── routes/                        # Route definitions
│   │   └── routes.go
│   │
│   ├── utils/                         # Helper functions
│   │   ├── response.go
│   │   ├── validator.go
│   │   ├── jwt.go
│   │   └── pagination.go
│   │
│   └── constants/                     # Constants
│       ├── errors.go
│       └── status.go
│
├── config/                            # Configuration
│   ├── config.yaml
│   ├── config.dev.yaml
│   ├── config.dev-shared.yaml
│   ├── config.staging.yaml
│   └── config.production.yaml
│
├── docs/                              # Documentation
│   ├── api.md
│   └── swagger.yaml
│
├── scripts/                           # Build & deploy scripts
│   ├── build.sh
│   └── deploy.sh
│
├── .env.example
├── .gitignore
├── go.mod
├── go.sum
├── Dockerfile
├── Makefile
└── README.md
```

---

## 🗄️ MongoDB Collections (snake_case)

```
user_accounts
user_roles
user_permissions
user_sessions
audit_logs
```

---

## 📄 File Templates

### 1. `cmd/api/main.go`

```go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/vhvplatform/go-shared/config"
    "github.com/vhvplatform/go-shared/logger"
    "github.com/vhvplatform/go-shared/mongodb"
    
    "github.com/vhvplatform/go-user-service/internal/routes"
    "github.com/gin-gonic/gin"
)

func main() {
    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("Failed to load config: %v", err)
    }

    // Initialize logger
    logger.Init(cfg.Logger)
    logger.Info("Starting User Service...")

    // Connect to MongoDB
    ctx := context.Background()
    mongoClient, err := mongodb.Connect(ctx, cfg.MongoDB)
    if err != nil {
        logger.Fatal("Failed to connect to MongoDB", "error", err)
    }
    defer mongoClient.Disconnect(ctx)

    // Get database instance
    db := mongoClient.Database(cfg.MongoDB.Database)
    logger.Info("Connected to MongoDB", "database", cfg.MongoDB.Database)

    // Initialize Gin router
    if cfg.Server.Mode == "production" {
        gin.SetMode(gin.ReleaseMode)
    }
    router := gin.New()

    // Setup routes
    routes.SetupRoutes(router, db, cfg)

    // Create HTTP server
    srv := &http.Server{
        Addr:           fmt.Sprintf(":%d", cfg.Server.Port),
        Handler:        router,
        ReadTimeout:    time.Duration(cfg.Server.ReadTimeout) * time.Second,
        WriteTimeout:   time.Duration(cfg.Server.WriteTimeout) * time.Second,
        MaxHeaderBytes: 1 << 20,
    }

    // Start server in goroutine
    go func() {
        logger.Info("Server starting", "port", cfg.Server.Port, "env", cfg.Environment)
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Fatal("Server failed to start", "error", err)
        }
    }()

    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    logger.Info("Shutting down server...")
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        logger.Fatal("Server forced to shutdown", "error", err)
    }

    logger.Info("Server exited")
}
```

---

### 2. `internal/models/user.go`

```go
package models

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

// Collection: user_accounts (snake_case)
type User struct {
    ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    Email        string             `json:"email" bson:"email"`
    Username     string             `json:"username" bson:"username"`
    Password     string             `json:"-" bson:"password"`
    FirstName    string             `json:"firstName" bson:"firstName"`     // camelCase
    LastName     string             `json:"lastName" bson:"lastName"`       // camelCase
    PhoneNumber  string             `json:"phoneNumber" bson:"phoneNumber"` // camelCase
    Avatar       string             `json:"avatar" bson:"avatar"`
    Status       string             `json:"status" bson:"status"` // active, inactive, suspended
    RoleID       primitive.ObjectID `json:"roleId" bson:"roleId"`
    
    // Metadata
    LastLoginAt  *time.Time `json:"lastLoginAt" bson:"lastLoginAt"`   // camelCase
    LoginCount   int64      `json:"loginCount" bson:"loginCount"`     // camelCase
    FailedAttempts int      `json:"failedAttempts" bson:"failedAttempts"` // camelCase
    
    // Timestamps
    CreatedAt    time.Time  `json:"createdAt" bson:"createdAt"`
    UpdatedAt    time.Time  `json:"updatedAt" bson:"updatedAt"`
    DeletedAt    *time.Time `json:"deletedAt,omitempty" bson:"deletedAt,omitempty"`
}

type Role struct {
    ID          primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
    Name        string               `json:"name" bson:"name"`
    Description string               `json:"description" bson:"description"`
    Permissions []primitive.ObjectID `json:"permissions" bson:"permissions"`
    IsSystem    bool                 `json:"isSystem" bson:"isSystem"` // camelCase
    CreatedAt   time.Time            `json:"createdAt" bson:"createdAt"`
    UpdatedAt   time.Time            `json:"updatedAt" bson:"updatedAt"`
}

type Permission struct {
    ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    Name        string             `json:"name" bson:"name"`
    Resource    string             `json:"resource" bson:"resource"`
    Action      string             `json:"action" bson:"action"` // read, write, delete
    Description string             `json:"description" bson:"description"`
    CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
}

// Collection: user_sessions (snake_case)
type Session struct {
    ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    UserID       primitive.ObjectID `json:"userId" bson:"userId"`     // camelCase
    AccessToken  string             `json:"accessToken" bson:"accessToken"`   // camelCase
    RefreshToken string             `json:"refreshToken" bson:"refreshToken"` // camelCase
    IPAddress    string             `json:"ipAddress" bson:"ipAddress"`       // camelCase
    UserAgent    string             `json:"userAgent" bson:"userAgent"`       // camelCase
    ExpiresAt    time.Time          `json:"expiresAt" bson:"expiresAt"`       // camelCase
    CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
    IsActive     bool               `json:"isActive" bson:"isActive"`         // camelCase
}

// DTOs
type CreateUserRequest struct {
    Email       string `json:"email" binding:"required,email"`
    Username    string `json:"username" binding:"required,min=3"`
    Password    string `json:"password" binding:"required,min=8"`
    FirstName   string `json:"firstName" binding:"required"`
    LastName    string `json:"lastName" binding:"required"`
    PhoneNumber string `json:"phoneNumber"`
    RoleID      string `json:"roleId" binding:"required"`
}

type UpdateUserRequest struct {
    FirstName   string `json:"firstName"`
    LastName    string `json:"lastName"`
    PhoneNumber string `json:"phoneNumber"`
    Avatar      string `json:"avatar"`
    Status      string `json:"status"`
}

type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
    User         *User  `json:"user"`
    AccessToken  string `json:"accessToken"`
    RefreshToken string `json:"refreshToken"`
    ExpiresIn    int64  `json:"expiresIn"`
}
```

---

### 3. `internal/repositories/user_repository.go`

```go
package repositories

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"

    "github.com/vhvplatform/go-user-service/internal/models"
)

type UserRepository interface {
    Create(ctx context.Context, user *models.User) error
    FindByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
    FindByEmail(ctx context.Context, email string) (*models.User, error)
    FindByUsername(ctx context.Context, username string) (*models.User, error)
    Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateUserRequest) error
    Delete(ctx context.Context, id primitive.ObjectID) error
    List(ctx context.Context, filter bson.M, page, limit int64) ([]*models.User, int64, error)
    UpdateLoginInfo(ctx context.Context, id primitive.ObjectID) error
}

type userRepository struct {
    collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) UserRepository {
    return &userRepository{
        collection: db.Collection("user_accounts"), // snake_case collection name
    }
}

func (r *userRepository) Create(ctx context.Context, user *models.User) error {
    user.CreatedAt = time.Now()
    user.UpdatedAt = time.Now()
    
    result, err := r.collection.InsertOne(ctx, user)
    if err != nil {
        return err
    }
    
    user.ID = result.InsertedID.(primitive.ObjectID)
    return nil
}

func (r *userRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
    var user models.User
    filter := bson.M{
        "_id": id,
        "deletedAt": bson.M{"$exists": false},
    }
    
    err := r.collection.FindOne(ctx, filter).Decode(&user)
    if err != nil {
        return nil, err
    }
    
    return &user, nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
    var user models.User
    filter := bson.M{
        "email": email,
        "deletedAt": bson.M{"$exists": false},
    }
    
    err := r.collection.FindOne(ctx, filter).Decode(&user)
    if err != nil {
        return nil, err
    }
    
    return &user, nil
}

func (r *userRepository) FindByUsername(ctx context.Context, username string) (*models.User, error) {
    var user models.User
    filter := bson.M{
        "username": username,
        "deletedAt": bson.M{"$exists": false},
    }
    
    err := r.collection.FindOne(ctx, filter).Decode(&user)
    if err != nil {
        return nil, err
    }
    
    return &user, nil
}

func (r *userRepository) Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateUserRequest) error {
    updateDoc := bson.M{
        "$set": bson.M{
            "updatedAt": time.Now(),
        },
    }
    
    // Build update document
    setDoc := updateDoc["$set"].(bson.M)
    
    if update.FirstName != "" {
        setDoc["firstName"] = update.FirstName
    }
    if update.LastName != "" {
        setDoc["lastName"] = update.LastName
    }
    if update.PhoneNumber != "" {
        setDoc["phoneNumber"] = update.PhoneNumber
    }
    if update.Avatar != "" {
        setDoc["avatar"] = update.Avatar
    }
    if update.Status != "" {
        setDoc["status"] = update.Status
    }
    
    filter := bson.M{"_id": id}
    _, err := r.collection.UpdateOne(ctx, filter, updateDoc)
    return err
}

func (r *userRepository) Delete(ctx context.Context, id primitive.ObjectID) error {
    now := time.Now()
    filter := bson.M{"_id": id}
    update := bson.M{
        "$set": bson.M{
            "deletedAt": now,
            "updatedAt": now,
        },
    }
    
    _, err := r.collection.UpdateOne(ctx, filter, update)
    return err
}

func (r *userRepository) List(ctx context.Context, filter bson.M, page, limit int64) ([]*models.User, int64, error) {
    // Add soft delete filter
    if filter == nil {
        filter = bson.M{}
    }
    filter["deletedAt"] = bson.M{"$exists": false}
    
    // Count total
    total, err := r.collection.CountDocuments(ctx, filter)
    if err != nil {
        return nil, 0, err
    }
    
    // Find with pagination
    skip := (page - 1) * limit
    opts := options.Find().
        SetSkip(skip).
        SetLimit(limit).
        SetSort(bson.D{{Key: "createdAt", Value: -1}})
    
    cursor, err := r.collection.Find(ctx, filter, opts)
    if err != nil {
        return nil, 0, err
    }
    defer cursor.Close(ctx)
    
    var users []*models.User
    if err = cursor.All(ctx, &users); err != nil {
        return nil, 0, err
    }
    
    return users, total, nil
}

func (r *userRepository) UpdateLoginInfo(ctx context.Context, id primitive.ObjectID) error {
    now := time.Now()
    filter := bson.M{"_id": id}
    update := bson.M{
        "$set": bson.M{
            "lastLoginAt": now,
            "updatedAt": now,
        },
        "$inc": bson.M{
            "loginCount": 1,
        },
    }
    
    _, err := r.collection.UpdateOne(ctx, filter, update)
    return err
}
```

---

### 4. `internal/services/user_service.go`

```go
package services

import (
    "context"
    "errors"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "golang.org/x/crypto/bcrypt"

    "github.com/vhvplatform/go-shared/logger"
    "github.com/vhvplatform/go-user-service/internal/models"
    "github.com/vhvplatform/go-user-service/internal/repositories"
)

type UserService interface {
    CreateUser(ctx context.Context, req *models.CreateUserRequest) (*models.User, error)
    GetUserByID(ctx context.Context, id string) (*models.User, error)
    UpdateUser(ctx context.Context, id string, req *models.UpdateUserRequest) error
    DeleteUser(ctx context.Context, id string) error
    ListUsers(ctx context.Context, filter bson.M, page, limit int64) ([]*models.User, int64, error)
}

type userService struct {
    userRepo repositories.UserRepository
}

func NewUserService(userRepo repositories.UserRepository) UserService {
    return &userService{
        userRepo: userRepo,
    }
}

func (s *userService) CreateUser(ctx context.Context, req *models.CreateUserRequest) (*models.User, error) {
    // Check if email already exists
    existingUser, err := s.userRepo.FindByEmail(ctx, req.Email)
    if err == nil && existingUser != nil {
        return nil, errors.New("email already exists")
    }
    
    // Check if username already exists
    existingUser, err = s.userRepo.FindByUsername(ctx, req.Username)
    if err == nil && existingUser != nil {
        return nil, errors.New("username already exists")
    }
    
    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        logger.Error("Failed to hash password", "error", err)
        return nil, errors.New("failed to process password")
    }
    
    // Convert roleID string to ObjectID
    roleOID, err := primitive.ObjectIDFromHex(req.RoleID)
    if err != nil {
        return nil, errors.New("invalid role ID")
    }
    
    // Create user
    user := &models.User{
        Email:       req.Email,
        Username:    req.Username,
        Password:    string(hashedPassword),
        FirstName:   req.FirstName,
        LastName:    req.LastName,
        PhoneNumber: req.PhoneNumber,
        RoleID:      roleOID,
        Status:      "active",
        LoginCount:  0,
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }
    
    if err := s.userRepo.Create(ctx, user); err != nil {
        logger.Error("Failed to create user", "error", err)
        return nil, err
    }
    
    logger.Info("User created successfully", "userId", user.ID.Hex(), "email", user.Email)
    return user, nil
}

func (s *userService) GetUserByID(ctx context.Context, id string) (*models.User, error) {
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, errors.New("invalid user ID")
    }
    
    user, err := s.userRepo.FindByID(ctx, objectID)
    if err != nil {
        logger.Error("Failed to get user", "userId", id, "error", err)
        return nil, errors.New("user not found")
    }
    
    return user, nil
}

func (s *userService) UpdateUser(ctx context.Context, id string, req *models.UpdateUserRequest) error {
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return errors.New("invalid user ID")
    }
    
    // Check if user exists
    _, err = s.userRepo.FindByID(ctx, objectID)
    if err != nil {
        return errors.New("user not found")
    }
    
    if err := s.userRepo.Update(ctx, objectID, req); err != nil {
        logger.Error("Failed to update user", "userId", id, "error", err)
        return err
    }
    
    logger.Info("User updated successfully", "userId", id)
    return nil
}

func (s *userService) DeleteUser(ctx context.Context, id string) error {
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return errors.New("invalid user ID")
    }
    
    if err := s.userRepo.Delete(ctx, objectID); err != nil {
        logger.Error("Failed to delete user", "userId", id, "error", err)
        return err
    }
    
    logger.Info("User deleted successfully", "userId", id)
    return nil
}

func (s *userService) ListUsers(ctx context.Context, filter bson.M, page, limit int64) ([]*models.User, int64, error) {
    users, total, err := s.userRepo.List(ctx, filter, page, limit)
    if err != nil {
        logger.Error("Failed to list users", "error", err)
        return nil, 0, err
    }
    
    return users, total, nil
}
```

---

### 5. `internal/handlers/user_handler.go`

```go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"

    "github.com/vhvplatform/go-user-service/internal/models"
    "github.com/vhvplatform/go-user-service/internal/services"
    "github.com/vhvplatform/go-user-service/internal/utils"
)

type UserHandler struct {
    userService services.UserService
}

func NewUserHandler(userService services.UserService) *UserHandler {
    return &UserHandler{
        userService: userService,
    }
}

// CreateUser godoc
// @Summary Create new user
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.CreateUserRequest true "User data"
// @Success 201 {object} utils.Response
// @Router /api/v1/users [post]
func (h *UserHandler) CreateUser(c *gin.Context) {
    var req models.CreateUserRequest
    
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body", err.Error())
        return
    }
    
    user, err := h.userService.CreateUser(c.Request.Context(), &req)
    if err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Failed to create user", err.Error())
        return
    }
    
    utils.SuccessResponse(c, http.StatusCreated, "User created successfully", user)
}

// GetUser godoc
// @Summary Get user by ID
// @Tags users
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/users/{id} [get]
func (h *UserHandler) GetUser(c *gin.Context) {
    id := c.Param("id")
    
    user, err := h.userService.GetUserByID(c.Request.Context(), id)
    if err != nil {
        utils.ErrorResponse(c, http.StatusNotFound, "User not found", err.Error())
        return
    }
    
    utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", user)
}

// UpdateUser godoc
// @Summary Update user
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param user body models.UpdateUserRequest true "User data"
// @Success 200 {object} utils.Response
// @Router /api/v1/users/{id} [put]
func (h *UserHandler) UpdateUser(c *gin.Context) {
    id := c.Param("id")
    
    var req models.UpdateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body", err.Error())
        return
    }
    
    if err := h.userService.UpdateUser(c.Request.Context(), id, &req); err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Failed to update user", err.Error())
        return
    }
    
    utils.SuccessResponse(c, http.StatusOK, "User updated successfully", nil)
}

// DeleteUser godoc
// @Summary Delete user
// @Tags users
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/users/{id} [delete]
func (h *UserHandler) DeleteUser(c *gin.Context) {
    id := c.Param("id")
    
    if err := h.userService.DeleteUser(c.Request.Context(), id); err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Failed to delete user", err.Error())
        return
    }
    
    utils.SuccessResponse(c, http.StatusOK, "User deleted successfully", nil)
}

// ListUsers godoc
// @Summary List users with pagination
// @Tags users
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Param status query string false "Filter by status"
// @Success 200 {object} utils.Response
// @Router /api/v1/users [get]
func (h *UserHandler) ListUsers(c *gin.Context) {
    page, _ := strconv.ParseInt(c.DefaultQuery("page", "1"), 10, 64)
    limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "10"), 10, 64)
    status := c.Query("status")
    
    // Build filter
    filter := bson.M{}
    if status != "" {
        filter["status"] = status
    }
    
    users, total, err := h.userService.ListUsers(c.Request.Context(), filter, page, limit)
    if err != nil {
        utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to list users", err.Error())
        return
    }
    
    utils.PaginatedResponse(c, http.StatusOK, "Users retrieved successfully", users, page, limit, total)
}
```

---

### 6. `internal/routes/routes.go`

```go
package routes

import (
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/mongo"

    "github.com/vhvplatform/go-shared/config"
    "github.com/vhvplatform/go-user-service/internal/handlers"
    "github.com/vhvplatform/go-user-service/internal/middleware"
    "github.com/vhvplatform/go-user-service/internal/repositories"
    "github.com/vhvplatform/go-user-service/internal/services"
)

func SetupRoutes(router *gin.Engine, db *mongo.Database, cfg *config.Config) {
    // Middleware
    router.Use(middleware.CORS())
    router.Use(middleware.Logger())
    router.Use(middleware.Recovery())
    router.Use(middleware.RateLimit())

    // Health check
    healthHandler := handlers.NewHealthHandler(db)
    router.GET("/health", healthHandler.Check)
    router.GET("/ready", healthHandler.Ready)

    // API v1
    v1 := router.Group("/api/v1")
    {
        // Public routes
        authRepo := repositories.NewUserRepository(db)
        authService := services.NewAuthService(authRepo, cfg)
        authHandler := handlers.NewAuthHandler(authService)
        
        auth := v1.Group("/auth")
        {
            auth.POST("/login", authHandler.Login)
            auth.POST("/register", authHandler.Register)
            auth.POST("/refresh", authHandler.RefreshToken)
            auth.POST("/logout", authHandler.Logout)
            auth.POST("/forgot-password", authHandler.ForgotPassword)
            auth.POST("/reset-password", authHandler.ResetPassword)
        }

        // Protected routes
        protected := v1.Group("")
        protected.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
        {
            // User routes
            userRepo := repositories.NewUserRepository(db)
            userService := services.NewUserService(userRepo)
            userHandler := handlers.NewUserHandler(userService)
            
            users := protected.Group("/users")
            {
                users.GET("", userHandler.ListUsers)
                users.POST("", userHandler.CreateUser)
                users.GET("/:id", userHandler.GetUser)
                users.PUT("/:id", userHandler.UpdateUser)
                users.DELETE("/:id", userHandler.DeleteUser)
            }

            // Role routes
            roleRepo := repositories.NewRoleRepository(db)
            roleService := services.NewRoleService(roleRepo)
            roleHandler := handlers.NewRoleHandler(roleService)
            
            roles := protected.Group("/roles")
            {
                roles.GET("", roleHandler.ListRoles)
                roles.POST("", roleHandler.CreateRole)
                roles.GET("/:id", roleHandler.GetRole)
                roles.PUT("/:id", roleHandler.UpdateRole)
                roles.DELETE("/:id", roleHandler.DeleteRole)
            }

            // Permission routes
            permRepo := repositories.NewPermissionRepository(db)
            permService := services.NewPermissionService(permRepo)
            permHandler := handlers.NewPermissionHandler(permService)
            
            permissions := protected.Group("/permissions")
            {
                permissions.GET("", permHandler.ListPermissions)
                permissions.POST("", permHandler.CreatePermission)
            }
        }
    }
}
```

---

### 7. `internal/utils/response.go`

```go
package utils

import (
    "github.com/gin-gonic/gin"
)

type Response struct {
    Success bool        `json:"success"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Error   string      `json:"error,omitempty"`
}

type PaginatedData struct {
    Items      interface{} `json:"items"`
    Page       int64       `json:"page"`
    Limit      int64       `json:"limit"`
    Total      int64       `json:"total"`
    TotalPages int64       `json:"totalPages"`
}

func SuccessResponse(c *gin.Context, statusCode int, message string, data interface{}) {
    c.JSON(statusCode, Response{
        Success: true,
        Message: message,
        Data:    data,
    })
}

func ErrorResponse(c *gin.Context, statusCode int, message string, error string) {
    c.JSON(statusCode, Response{
        Success: false,
        Message: message,
        Error:   error,
    })
}

func PaginatedResponse(c *gin.Context, statusCode int, message string, items interface{}, page, limit, total int64) {
    totalPages := (total + limit - 1) / limit
    
    c.JSON(statusCode, Response{
        Success: true,
        Message: message,
        Data: PaginatedData{
            Items:      items,
            Page:       page,
            Limit:      limit,
            Total:      total,
            TotalPages: totalPages,
        },
    })
}
```

---

### 8. `internal/middleware/auth.go`

```go
package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"

    "github.com/vhvplatform/go-user-service/internal/utils"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            utils.ErrorResponse(c, http.StatusUnauthorized, "Authorization header required", "missing token")
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        if tokenString == authHeader {
            utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid authorization format", "Bearer token required")
            c.Abort()
            return
        }

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(jwtSecret), nil
        })

        if err != nil || !token.Valid {
            utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid or expired token", err.Error())
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid token claims", "")
            c.Abort()
            return
        }

        c.Set("userId", claims["userId"])
        c.Set("email", claims["email"])
        c.Set("roleId", claims["roleId"])
        
        c.Next()
    }
}
```

---

### 9. `config/config.yaml`

```yaml
# Base configuration
environment: development
serviceName: user-service
version: 1.0.0

server:
  port: 8080
  mode: debug
  readTimeout: 30
  writeTimeout: 30
  
mongodb:
  uri: mongodb://localhost:27017
  database: vhv_platform_dev
  maxPoolSize: 100
  minPoolSize: 10
  
jwt:
  secret: your-secret-key-here
  accessTokenExpiry: 3600      # 1 hour
  refreshTokenExpiry: 2592000  # 30 days
  
logger:
  level: debug
  format: json
  output: stdout
  
rateLimit:
  requestsPerSecond: 100
  burst: 200
```

---

### 10. `Makefile`

```makefile
.PHONY: run build test clean docker-build docker-run migrate

# Variables
APP_NAME=go-user-service
DOCKER_IMAGE=$(APP_NAME):latest
GO=go
GOTEST=$(GO) test
GOBUILD=$(GO) build
ENV?=dev

# Run application
run:
	$(GO) run cmd/api/main.go

# Build application
build:
	$(GOBUILD) -o bin/$(APP_NAME) cmd/api/main.go

# Run tests
test:
	$(GOTEST) -v -cover ./...

# Clean build files
clean:
	rm -rf bin/

# Docker build
docker-build:
	docker build -t $(DOCKER_IMAGE) .

# Docker run
docker-run:
	docker run -p 8080:8080 --env-file .env $(DOCKER_IMAGE)

# Load environment
load-env:
	cp config/config.$(ENV).yaml config/config.yaml

# Database migration
migrate:
	$(GO) run scripts/migrate.go
```

---

## 🔧 Dependencies (go.mod)

```go
module github.com/vhvplatform/go-user-service

go 1.21

require (
    github.com/gin-gonic/gin v1.10.0
    github.com/golang-jwt/jwt/v5 v5.2.0
    go.mongodb.org/mongo-driver v1.13.1
    golang.org/x/crypto v0.18.0
    
    // VHV Platform shared libraries
    github.com/vhvplatform/go-shared/config v1.0.0
    github.com/vhvplatform/go-shared/logger v1.0.0
    github.com/vhvplatform/go-shared/mongodb v1.0.0
)
```

---

## 🎯 Key Features

✅ **Clean Architecture** - Separation of concerns  
✅ **MongoDB Integration** - Using vhvplatform/go-shared/mongodb  
✅ **Structured Logging** - Using vhvplatform/go-shared/logger  
✅ **Environment Config** - Using vhvplatform/go-shared/config  
✅ **JWT Authentication** - Secure token-based auth  
✅ **RBAC** - Role-based access control  
✅ **Middleware** - CORS, Rate limiting, Recovery  
✅ **Pagination** - Efficient data listing  
✅ **Soft Delete** - Data preservation  
✅ **Graceful Shutdown** - Clean server termination  

---

## 📊 MongoDB Naming Convention

**Collections (snake_case):**
- `user_accounts`
- `user_roles`
- `user_permissions`
- `user_sessions`
- `audit_logs`

**Fields (camelCase):**
```json
{
  "_id": "ObjectId",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+84123456789",
  "lastLoginAt": "2025-01-03T10:00:00Z",
  "createdAt": "2025-01-01T10:00:00Z"
}
```
