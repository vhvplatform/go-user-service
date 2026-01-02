package main

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/vhvplatform/go-shared/config"
	"github.com/vhvplatform/go-shared/logger"
	"github.com/vhvplatform/go-shared/mongodb"
	"github.com/vhvplatform/go-user-service/docs"
	"github.com/vhvplatform/go-user-service/internal/grpc"
	"github.com/vhvplatform/go-user-service/internal/handler"
	"github.com/vhvplatform/go-user-service/internal/middleware"
	"github.com/vhvplatform/go-user-service/internal/repository"
	"github.com/vhvplatform/go-user-service/internal/service"
	// pb "github.com/vhvplatform/go-user-service/proto"
	"go.uber.org/zap"
	grpcServer "google.golang.org/grpc"
	"google.golang.org/grpc/health"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
)

// @title User Service API
// @version 1.0
// @description Multi-tenant User Management Service with REST and gRPC APIs
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.vhvplatform.com/support
// @contact.email support@vhvplatform.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8082
// @BasePath /
// @schemes http https

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Sprintf("Failed to load config: %v", err))
	}

	// Initialize logger
	log, err := logger.New(cfg.LogLevel)
	if err != nil {
		panic(fmt.Sprintf("Failed to initialize logger: %v", err))
	}
	defer log.Sync()

	log.Info("Starting User Service", zap.String("environment", cfg.Environment))

	// Initialize MongoDB
	mongoClient, err := mongodb.NewClient(context.Background(), mongodb.Config{
		URI:         cfg.MongoDB.URI,
		Database:    cfg.MongoDB.Database,
		MaxPoolSize: cfg.MongoDB.MaxPoolSize,
		MinPoolSize: cfg.MongoDB.MinPoolSize,
	})
	if err != nil {
		log.Fatal("Failed to connect to MongoDB", zap.Error(err))
	}
	defer mongoClient.Close(context.Background())

	// Initialize repositories
	userRepo := repository.NewUserRepository(mongoClient.Database())

	// Initialize services
	userService := service.NewUserService(userRepo, log)

	// Start gRPC server
	grpcPort := os.Getenv("USER_SERVICE_PORT")
	if grpcPort == "" {
		grpcPort = "50052"
	}
	go startGRPCServer(userService, log, grpcPort)

	// Start HTTP server
	httpPort := os.Getenv("USER_SERVICE_HTTP_PORT")
	if httpPort == "" {
		httpPort = "8082"
	}
	startHTTPServer(userService, log, httpPort)
}

func startGRPCServer(userService *service.UserService, log *logger.Logger, port string) {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal("Failed to listen", zap.Error(err))
	}

	grpcSrv := grpcServer.NewServer()
	userGrpcServer := grpc.NewUserServiceServer(userService, log)
	// pb.RegisterUserServiceServer(grpcSrv, userGrpcServer)
	_ = userGrpcServer // Use the variable to avoid unused error

	// Register health check service
	healthServer := health.NewServer()
	healthpb.RegisterHealthServer(grpcSrv, healthServer)
	healthServer.SetServingStatus("", healthpb.HealthCheckResponse_SERVING)

	log.Info("gRPC server listening", zap.String("port", port))
	if err := grpcSrv.Serve(lis); err != nil {
		log.Fatal("Failed to serve gRPC", zap.Error(err))
	}
}

func startHTTPServer(userService *service.UserService, log *logger.Logger, port string) {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Recovery())

	if envHost := os.Getenv("SWAGGER_HOST"); envHost != "" {
		docs.SwaggerInfo.Host = envHost
	} else {
		docs.SwaggerInfo.Host = "" // Để rỗng để tự nhận diện theo Browser
	}

	// 3. Schemes: Hỗ trợ cả http và https
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	// Initialize handlers
	userHandler := handler.NewUserHandler(userService, log)

	// Swagger endpoint
	router.GET("/api/v1/users/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Health check endpoints
	router.GET("/api/v1/users/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	router.GET("/api/v1/users/ready", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ready"})
	})

	// API routes
	v1 := router.Group("/api/v1")
	{
		// Tenant-aware user routes
		users := v1.Group("/users")
		users.Use(middleware.TenancyMiddleware())
		{
			users.POST("", userHandler.CreateUser)
			users.GET("", userHandler.ListUsers)
			users.GET("/search", userHandler.SearchUsers)
			users.GET("/:id", userHandler.GetUser)
			users.PUT("/:id", userHandler.UpdateUser)
			users.DELETE("/:id", userHandler.DeleteUser)
		}
	}

	// Create HTTP server with security configurations
	srv := &http.Server{
		Addr:              fmt.Sprintf(":%s", port),
		Handler:           router,
		ReadHeaderTimeout: 10 * time.Second, // Prevent Slowloris attacks
	}

	// Start server in goroutine
	go func() {
		log.Info("HTTP server listening", zap.String("port", port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start HTTP server", zap.Error(err))
		}
	}()

	// Wait for interrupt signal to gracefully shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown", zap.Error(err))
	}

	log.Info("Server exited")
}
