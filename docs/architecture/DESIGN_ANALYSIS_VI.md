# Tài Liệu Phân Tích và Thiết Kế - Dịch Vụ Quản Lý Người Dùng

> **Go User Service** - Microservice quản lý người dùng trong môi trường SaaS đa thuê bao

## Mục Lục

1. [Giới Thiệu Tổng Quan](#1-giới-thiệu-tổng-quan)
2. [Mục Tiêu Hệ Thống](#2-mục-tiêu-hệ-thống)
3. [Phân Tích Yêu Cầu](#3-phân-tích-yêu-cầu)
4. [Mô Hình Thực Thể và Thiết Kế Cơ Sở Dữ Liệu](#4-mô-hình-thực-thể-và-thiết-kế-cơ-sở-dữ-liệu)
5. [Kiến Trúc Hệ Thống](#5-kiến-trúc-hệ-thống)
6. [Các Thành Phần Chính](#6-các-thành-phần-chính)
7. [Bảo Mật và Quyền Riêng Tư](#7-bảo-mật-và-quyền-riêng-tư)
8. [Khả Năng Mở Rộng](#8-khả-năng-mở-rộng)
9. [Tuân Thủ GDPR](#9-tuân-thủ-gdpr)

---

## 1. Giới Thiệu Tổng Quan

### 1.1. Tổng Quan Dự Án

**Go User Service** là một microservice toàn diện được thiết kế để quản lý hồ sơ người dùng, dữ liệu xác thực và tùy chọn trong môi trường SaaS đa thuê bao (multi-tenant). Dịch vụ này được xây dựng bằng ngôn ngữ Go (Golang) và tuân theo các nguyên tắc Clean Architecture để đảm bảo tính bảo trì, khả năng kiểm thử và độc lập với framework.

### 1.2. Bối Cảnh

Dịch vụ này là một phần của SaaS Framework được trích xuất từ monorepo và tuân thủ các tiêu chuẩn kiến trúc của [go-infrastructure](https://github.com/vhvplatform/go-infrastructure). Nó được thiết kế để hoạt động như một microservice độc lập có thể được tích hợp vào bất kỳ nền tảng SaaS nào.

### 1.3. Phạm Vi

Dịch vụ cung cấp các chức năng sau:
- Quản lý CRUD người dùng (Create, Read, Update, Delete)
- Hỗ trợ đa thuê bao với cô lập dữ liệu
- Tìm kiếm và lọc người dùng nâng cao
- Quản lý tùy chọn người dùng
- Tuân thủ GDPR và bảo vệ dữ liệu cá nhân
- API HTTP REST và gRPC

### 1.4. Công Nghệ Sử Dụng

- **Ngôn ngữ**: Go 1.25.5
- **Web Framework**: Gin (HTTP), gRPC (RPC)
- **Cơ sở dữ liệu**: MongoDB 4.4+
- **Cache**: Redis 6.0+ (tùy chọn)
- **Logging**: Uber Zap
- **Validation**: go-playground/validator

---

## 2. Mục Tiêu Hệ Thống

### 2.1. Mục Tiêu Chính

1. **Quản Lý Người Dùng Hiệu Quả**
   - Cung cấp các thao tác CRUD đầy đủ cho hồ sơ người dùng
   - Đảm bảo tính toàn vẹn và tính nhất quán của dữ liệu
   - Hỗ trợ tìm kiếm và lọc người dùng nhanh chóng

2. **Cô Lập Đa Thuê Bao**
   - Đảm bảo dữ liệu của mỗi thuê bao được cô lập hoàn toàn
   - Ngăn chặn truy cập trái phép giữa các thuê bao
   - Hỗ trợ các mô hình định tuyến đa thuê bao khác nhau

3. **Bảo Mật và Quyền Riêng Tư**
   - Bảo vệ dữ liệu cá nhân của người dùng
   - Tuân thủ các quy định về bảo vệ dữ liệu (GDPR)
   - Ngăn chặn các lỗ hổng bảo mật phổ biến (SQL injection, XSS)

4. **Hiệu Suất và Khả Năng Mở Rộng**
   - Xử lý hàng nghìn yêu cầu đồng thời
   - Hỗ trợ mở rộng ngang (horizontal scaling)
   - Tối ưu hóa truy vấn cơ sở dữ liệu

5. **Khả Năng Bảo Trì và Kiểm Thử**
   - Mã nguồn sạch, dễ đọc và dễ bảo trì
   - Kiểm thử đơn vị và tích hợp toàn diện
   - Tài liệu kỹ thuật chi tiết

### 2.2. Mục Tiêu Phi Chức Năng

- **Độ sẵn sàng**: 99.9% uptime
- **Hiệu suất**: Thời gian phản hồi < 100ms cho các thao tác đơn giản
- **Khả năng mở rộng**: Hỗ trợ hàng triệu người dùng
- **Bảo mật**: Tuân thủ OWASP Top 10 và GDPR
- **Khả năng bảo trì**: Code coverage > 80%

---

## 3. Phân Tích Yêu Cầu

### 3.1. Yêu Cầu Chức Năng

#### 3.1.1. Quản Lý Người Dùng

**RF-001: Tạo Người Dùng**
- **Mô tả**: Hệ thống phải cho phép tạo hồ sơ người dùng mới
- **Input**: Email, tenant_id, first_name, last_name, phone (tùy chọn)
- **Output**: Thông tin người dùng đã tạo với ID duy nhất
- **Ràng buộc**: 
  - Email phải là duy nhất trong cùng một thuê bao
  - Email phải có định dạng hợp lệ
  - Tenant ID là bắt buộc
- **Xử lý lỗi**: 
  - Trả về lỗi 409 Conflict nếu email đã tồn tại
  - Trả về lỗi 400 Bad Request nếu dữ liệu không hợp lệ

**RF-002: Lấy Thông Tin Người Dùng**
- **Mô tả**: Hệ thống phải cho phép truy xuất thông tin người dùng theo ID
- **Input**: User ID, Tenant ID
- **Output**: Thông tin đầy đủ của người dùng
- **Ràng buộc**: 
  - Chỉ lấy được người dùng trong cùng thuê bao
  - User ID phải là ObjectID hợp lệ
- **Xử lý lỗi**: 
  - Trả về lỗi 404 Not Found nếu người dùng không tồn tại

**RF-003: Liệt Kê Người Dùng**
- **Mô tả**: Hệ thống phải cho phép liệt kê tất cả người dùng của một thuê bao
- **Input**: Tenant ID, page, page_size
- **Output**: Danh sách người dùng với phân trang
- **Ràng buộc**: 
  - Hỗ trợ phân trang (mặc định 20 người dùng/trang)
  - Tối đa 100 người dùng/trang
- **Sắp xếp**: Mặc định theo thời gian tạo (mới nhất trước)

**RF-004: Tìm Kiếm Người Dùng**
- **Mô tả**: Hệ thống phải hỗ trợ tìm kiếm người dùng theo từ khóa
- **Input**: Tenant ID, query string, page, page_size
- **Output**: Danh sách người dùng phù hợp với phân trang
- **Tìm kiếm trong**: first_name, last_name, email
- **Công nghệ**: MongoDB text search với indexes

**RF-005: Cập Nhật Người Dùng**
- **Mô tả**: Hệ thống phải cho phép cập nhật thông tin người dùng
- **Input**: User ID, Tenant ID, dữ liệu cập nhật
- **Output**: Thông tin người dùng đã cập nhật
- **Trường có thể cập nhật**: first_name, last_name, phone, avatar_url
- **Ràng buộc**: Không được thay đổi email và tenant_id

**RF-006: Xóa Người Dùng (Soft Delete)**
- **Mô tả**: Hệ thống phải hỗ trợ xóa mềm người dùng
- **Input**: User ID, Tenant ID
- **Output**: Xác nhận xóa thành công
- **Hành vi**: Đặt is_active = false, không xóa dữ liệu vật lý
- **Mục đích**: Giữ lại audit trail và tuân thủ quy định

#### 3.1.2. Quản Lý Tùy Chọn Người Dùng

**RF-007: Lưu Tùy Chọn Người Dùng**
- **Mô tả**: Hệ thống phải cho phép lưu trữ tùy chọn cá nhân hóa
- **Tùy chọn**: language, timezone, theme, custom settings
- **Lưu trữ**: Collection riêng biệt (user_preferences)

#### 3.1.3. Tuân Thủ GDPR

**RF-008: Quyền Truy Cập Dữ Liệu**
- **Mô tả**: Người dùng có quyền xem tất cả dữ liệu cá nhân của họ
- **Output**: Export dữ liệu ở định dạng JSON

**RF-009: Quyền Xóa Dữ Liệu**
- **Mô tả**: Người dùng có quyền yêu cầu xóa dữ liệu cá nhân
- **Hành vi**: Ẩn danh hóa dữ liệu sau grace period

### 3.2. Yêu Cầu Phi Chức Năng

#### 3.2.1. Hiệu Suất

**NFR-001: Thời Gian Phản Hồi**
- Các thao tác CRUD đơn giản: < 100ms (P95)
- Tìm kiếm với phân trang: < 200ms (P95)
- Thao tác phức tạp: < 500ms (P95)

**NFR-002: Throughput**
- Xử lý tối thiểu 1000 requests/second
- Hỗ trợ 10,000 concurrent connections

**NFR-003: Khả Năng Mở Rộng**
- Hỗ trợ horizontal scaling (thêm instance)
- Hỗ trợ database sharding theo tenant_id
- Stateless service design

#### 3.2.2. Độ Tin Cậy

**NFR-004: Độ Sẵn Sàng**
- SLA: 99.9% uptime (43.2 phút downtime/tháng)
- Graceful shutdown với timeout 5 giây
- Health check endpoints

**NFR-005: Khả Năng Phục Hồi**
- Automatic retry với exponential backoff
- Circuit breaker cho external dependencies
- Database connection pooling

#### 3.2.3. Bảo Mật

**NFR-006: Xác Thực và Phân Quyền**
- Tất cả endpoints yêu cầu X-Tenant-ID header
- Validation tenant ID từ JWT token
- Không lưu trữ password (delegated to auth service)

**NFR-007: Bảo Vệ Dữ Liệu**
- Encryption at rest (MongoDB encryption)
- Encryption in transit (TLS 1.3)
- Input validation và sanitization
- Ngăn chặn SQL injection, XSS, CSRF

**NFR-008: Audit và Logging**
- Log tất cả thao tác CRUD
- Log bao gồm: user_id, tenant_id, action, timestamp
- Retention: 7 năm (compliance)

#### 3.2.4. Khả Năng Bảo Trì

**NFR-009: Code Quality**
- Code coverage > 80%
- Tuân thủ Go coding standards
- Golangci-lint pass
- No critical security vulnerabilities

**NFR-010: Tài Liệu**
- API documentation (Swagger/OpenAPI)
- Architecture documentation
- Deployment documentation
- Code comments cho logic phức tạp

#### 3.2.5. Khả Năng Giám Sát

**NFR-011: Observability**
- Structured logging với Zap
- Prometheus metrics
- Distributed tracing (OpenTelemetry)
- Error tracking và alerting

---

## 4. Mô Hình Thực Thể và Thiết Kế Cơ Sở Dữ Liệu

### 4.1. Mô Hình Thực Thể Quan Hệ

Hệ thống sử dụng MongoDB làm cơ sở dữ liệu chính với các collections sau:

#### 4.1.1. Users Collection

**Mục đích**: Lưu trữ thông tin hồ sơ người dùng

**Cấu trúc**:

```go
type User struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    Email     string             `bson:"email"`
    TenantID  string             `bson:"tenant_id"`
    FirstName string             `bson:"first_name"`
    LastName  string             `bson:"last_name"`
    Phone     string             `bson:"phone,omitempty"`
    AvatarURL string             `bson:"avatar_url,omitempty"`
    IsActive  bool               `bson:"is_active"`
    CreatedAt time.Time          `bson:"created_at"`
    UpdatedAt time.Time          `bson:"updated_at"`
}
```

**Indexes**:
1. `{email: 1, tenant_id: 1}` - Unique, đảm bảo email duy nhất trong thuê bao
2. `{tenant_id: 1}` - Tối ưu truy vấn theo thuê bao
3. `{is_active: 1, tenant_id: 1}` - Lọc người dùng active
4. `{created_at: -1}` - Sắp xếp theo thời gian
5. `{first_name: "text", last_name: "text", email: "text"}` - Full-text search

**Ràng buộc**:
- Email phải unique trong cùng tenant_id
- TenantID bắt buộc
- Email phải hợp lệ (regex validation)

#### 4.1.2. User Preferences Collection

**Mục đích**: Lưu trữ tùy chọn cá nhân hóa của người dùng

**Cấu trúc**:

```go
type UserPreferences struct {
    ID       primitive.ObjectID     `bson:"_id,omitempty"`
    UserID   string                 `bson:"user_id"`
    TenantID string                 `bson:"tenant_id"`
    Language string                 `bson:"language"`
    Timezone string                 `bson:"timezone"`
    Theme    string                 `bson:"theme"`
    Settings map[string]interface{} `bson:"settings,omitempty"`
}
```

**Indexes**:
1. `{user_id: 1, tenant_id: 1}` - Unique
2. `{tenant_id: 1}` - Query optimization

**Quan hệ**: 1 User - 1 UserPreferences (One-to-One)

#### 4.1.3. User Roles Collection (Future)

**Mục đích**: Quản lý vai trò và quyền của người dùng (RBAC)

**Cấu trúc**:

```go
type UserRole struct {
    ID         primitive.ObjectID `bson:"_id,omitempty"`
    UserID     string             `bson:"user_id"`
    RoleID     string             `bson:"role_id"`
    TenantID   string             `bson:"tenant_id"`
    AssignedAt time.Time          `bson:"assigned_at"`
}
```

#### 4.1.4. Audit Logs Collection

**Mục đích**: Lưu trữ audit trail cho compliance

**Cấu trúc**:

```go
type AuditLog struct {
    ID         primitive.ObjectID     `bson:"_id,omitempty"`
    UserID     string                 `bson:"user_id"`
    TenantID   string                 `bson:"tenant_id"`
    ActorID    string                 `bson:"actor_id"`
    Action     string                 `bson:"action"`
    Resource   string                 `bson:"resource"`
    ResourceID string                 `bson:"resource_id"`
    Changes    map[string]interface{} `bson:"changes"`
    IPAddress  string                 `bson:"ip_address"`
    Timestamp  time.Time              `bson:"timestamp"`
}
```

**Indexes**:
1. `{user_id: 1, timestamp: -1}`
2. `{tenant_id: 1, timestamp: -1}`
3. `{timestamp: -1}` - TTL index

### 4.2. Chiến Lược Đa Thuê Bao

**Mô hình**: Database-level isolation với tenant_id

**Đặc điểm**:
- Tất cả collections đều có trường `tenant_id`
- Tất cả queries đều filter theo `tenant_id`
- Indexes compound bao gồm `tenant_id`
- Unique constraints bao gồm `tenant_id`

**Lợi ích**:
- Chi phí thấp (single database)
- Dễ quản lý và backup
- Tối ưu cho số lượng tenant lớn

**Bảo mật**:
- Middleware kiểm tra X-Tenant-ID header
- Tất cả queries bắt buộc có tenant_id filter
- Không bao giờ query cross-tenant

### 4.3. Chiến Lược Indexing

**Nguyên tắc**:
1. **Index theo tenant_id**: Tất cả query patterns
2. **Compound indexes**: Thường query với tenant_id + field khác
3. **Text indexes**: Cho full-text search
4. **TTL indexes**: Cho data có expiration

**Ví dụ tối ưu**:
```javascript
// Query: Tìm user theo email trong tenant
db.users.find({ email: "user@example.com", tenant_id: "tenant123" })
// Index: { email: 1, tenant_id: 1 }

// Query: List users của tenant, sort by created_at
db.users.find({ tenant_id: "tenant123" }).sort({ created_at: -1 })
// Index: { tenant_id: 1, created_at: -1 }

// Query: Full-text search trong tenant
db.users.find({ tenant_id: "tenant123", $text: { $search: "john" } })
// Index: { first_name: "text", last_name: "text", email: "text" }
// + Index: { tenant_id: 1 }
```

### 4.4. Chiến Lược Backup và Recovery

**Backup**:
- Automated daily backups
- Point-in-time recovery
- Backup retention: 30 days

**Recovery**:
- RPO (Recovery Point Objective): 24 hours
- RTO (Recovery Time Objective): 4 hours

---

## 5. Kiến Trúc Hệ Thống

### 5.1. Tổng Quan Kiến Trúc

Hệ thống áp dụng **Clean Architecture** (Robert C. Martin) với phân tách rõ ràng các layers:

```
┌─────────────────────────────────────────────────────┐
│              External Interfaces                     │
│         (HTTP API, gRPC, CLI, etc.)                 │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│            Interface Adapters                        │
│    (Handlers, Controllers, Presenters)              │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│          Application Business Rules                  │
│         (Use Cases, Services)                       │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│        Enterprise Business Rules                     │
│              (Entities, Domain)                     │
└─────────────────────────────────────────────────────┘
```

### 5.2. Dependency Rule

**Nguyên tắc quan trọng**: Dependencies chỉ được trỏ vào trong (inward)

```
External → Handler → Service → Repository → Domain
```

- **Domain**: Không phụ thuộc vào bất cứ thứ gì
- **Repository**: Chỉ phụ thuộc vào Domain
- **Service**: Phụ thuộc vào Domain và Repository interfaces
- **Handler**: Phụ thuộc vào Domain và Service
- **External (main.go)**: Wire tất cả dependencies

### 5.3. Cấu Trúc Thư Mục

```
go-user-service/
├── cmd/
│   └── main.go                 # Entry point, dependency injection
├── internal/
│   ├── domain/                 # Enterprise Business Rules
│   │   ├── models.go          # Entities (User, UserPreferences)
│   │   └── requests.go        # DTOs (Request/Response)
│   ├── service/               # Application Business Rules
│   │   └── user_service.go    # Use cases, business logic
│   ├── repository/            # Data Access Layer
│   │   └── user_repository.go # Database operations
│   ├── handler/               # Interface Adapters (HTTP)
│   │   └── user_handler.go    # HTTP request handlers
│   ├── grpc/                  # Interface Adapters (gRPC)
│   │   └── user_grpc.go       # gRPC service implementation
│   ├── middleware/            # Cross-cutting concerns
│   │   └── tenancy.go         # Multi-tenancy middleware
│   └── validation/            # Input validation utilities
│       └── validators.go
├── proto/                     # Protocol buffer definitions
├── docs/                      # Documentation
│   ├── diagrams/             # PlantUML diagrams
│   └── *.md                  # Technical docs
└── Dockerfile                # Container definition
```

### 5.4. Luồng Dữ Liệu

**Ví dụ: Create User Flow**

```
1. HTTP Request (POST /api/v1/users)
   ↓
2. Tenancy Middleware (validate X-Tenant-ID)
   ↓
3. Handler.CreateUser
   - Bind JSON request
   - Extract tenant ID from context
   ↓
4. Service.CreateUser
   - Validate input (email, phone, name)
   - Sanitize input (remove XSS)
   - Check if user exists (FindByEmail)
   - Create User domain model
   ↓
5. Repository.Create
   - Set timestamps (created_at, updated_at)
   - Insert to MongoDB
   - Return user with generated ID
   ↓
6. Service (continued)
   - Log audit trail
   - Return User domain model
   ↓
7. Handler (continued)
   - Convert to UserResponse DTO
   - Return 201 Created with JSON
   ↓
8. HTTP Response
```

### 5.5. Giao Tiếp Giữa Các Services

**Protocols**:
1. **HTTP REST**: External clients, API Gateway
2. **gRPC**: Inter-service communication (higher performance)

**Service Discovery**:
- Environment variables cho service URLs
- Support cho Kubernetes service discovery

**Communication Patterns**:
- Synchronous: HTTP/gRPC (request-response)
- Asynchronous: RabbitMQ/Redis (future - events)

---

## 6. Các Thành Phần Chính

### 6.1. Domain Layer (internal/domain/)

**Trách nhiệm**:
- Định nghĩa business entities
- Định nghĩa DTOs (Data Transfer Objects)
- Chứa core business rules
- Không phụ thuộc vào framework hay infrastructure

**Components**:

#### 6.1.1. Models (models.go)
```go
// User entity - Core business object
type User struct {
    ID        primitive.ObjectID // Unique identifier
    Email     string             // User email (unique per tenant)
    TenantID  string             // Multi-tenancy isolation
    FirstName string             // User first name
    LastName  string             // User last name
    Phone     string             // Phone number (optional)
    AvatarURL string             // Profile picture URL
    IsActive  bool               // Soft delete flag
    CreatedAt time.Time          // Creation timestamp
    UpdatedAt time.Time          // Last update timestamp
}

// UserPreferences - User personalization settings
type UserPreferences struct {
    ID       primitive.ObjectID     // Unique identifier
    UserID   string                 // Reference to User
    TenantID string                 // Multi-tenancy
    Language string                 // UI language (e.g., "en", "vi")
    Timezone string                 // User timezone
    Theme    string                 // UI theme (light/dark)
    Settings map[string]interface{} // Flexible settings
}
```

#### 6.1.2. Requests (requests.go)
```go
// DTOs for API communication

type CreateUserRequest struct {
    Email     string `json:"email" binding:"required,email"`
    TenantID  string `json:"tenant_id" binding:"required"`
    FirstName string `json:"first_name" binding:"required"`
    LastName  string `json:"last_name" binding:"required"`
    Phone     string `json:"phone,omitempty"`
}

type UpdateUserRequest struct {
    FirstName string `json:"first_name,omitempty"`
    LastName  string `json:"last_name,omitempty"`
    Phone     string `json:"phone,omitempty"`
    AvatarURL string `json:"avatar_url,omitempty"`
}

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
```

### 6.2. Service Layer (internal/service/)

**Trách nhiệm**:
- Implement business logic
- Orchestrate use cases
- Validate business rules
- Coordinate giữa repositories
- Audit logging

**Key Features**:
- Input validation và sanitization
- Business rule enforcement
- Error handling và logging
- Transaction management

**Example: User Service**

```go
type UserService struct {
    userRepo *repository.UserRepository
    logger   *logger.Logger
}

// Business logic methods:
// - CreateUser: Validate, check duplicates, create
// - GetUser: Validate ID, fetch from repo
// - ListUsers: Pagination, filtering
// - SearchUsers: Full-text search
// - UpdateUser: Validate, partial update
// - DeleteUser: Soft delete, audit log
```

**Business Rules Enforced**:
1. Email phải unique trong tenant
2. Không thể thay đổi email sau khi tạo
3. Không thể thay đổi tenant_id
4. Phone number phải theo format E.164 (nếu có)
5. Names phải được sanitize (remove HTML/script tags)

### 6.3. Repository Layer (internal/repository/)

**Trách nhiệm**:
- Abstract data access
- Implement database operations
- Handle MongoDB-specific code
- Manage indexes và constraints
- Connection pooling

**Key Features**:
- Parameterized queries (prevent SQL injection)
- Index management
- Error handling
- Pagination support

**Example: User Repository**

```go
type UserRepository struct {
    collection *mongo.Collection
}

// Data access methods:
// - Create(user) error
// - FindByID(id, tenantID) (*User, error)
// - FindByEmail(email, tenantID) (*User, error)
// - List(tenantID, page, pageSize) ([]*User, int64, error)
// - Search(tenantID, query, page, pageSize) ([]*User, int64, error)
// - Update(user) error
// - Delete(id, tenantID) error (soft delete)
```

**Query Patterns**:
```go
// Always include tenant_id in queries
filter := bson.M{
    "email":     email,
    "tenant_id": tenantID, // Mandatory for isolation
}

// Use indexes efficiently
opts := options.Find().
    SetSort(bson.D{{Key: "created_at", Value: -1}}).
    SetSkip(int64(skip)).
    SetLimit(int64(pageSize))
```

### 6.4. Handler Layer (internal/handler/)

**Trách nhiệm**:
- Handle HTTP requests
- Parse và validate request format
- Call service layer
- Format HTTP responses
- Error handling

**Key Features**:
- Gin framework integration
- Request binding và validation
- Tenant ID extraction
- Response formatting
- HTTP status codes

**Example: User Handler**

```go
type UserHandler struct {
    userService *service.UserService
    logger      *logger.Logger
}

// HTTP endpoints:
// - CreateUser: POST /api/v1/users
// - GetUser: GET /api/v1/users/:id
// - ListUsers: GET /api/v1/users
// - SearchUsers: GET /api/v1/users/search?q=query
// - UpdateUser: PUT /api/v1/users/:id
// - DeleteUser: DELETE /api/v1/users/:id
```

### 6.5. gRPC Layer (internal/grpc/)

**Trách nhiệm**:
- Implement gRPC service
- Convert protobuf ↔ domain models
- Call service layer
- Handle gRPC-specific errors

**Use Cases**:
- Inter-service communication
- High-performance APIs
- Strongly-typed contracts

### 6.6. Middleware Layer (internal/middleware/)

**Trách nhiệm**:
- Cross-cutting concerns
- Request preprocessing
- Authentication và authorization
- Multi-tenancy enforcement

**Key Middleware**:

#### 6.6.1. Tenancy Middleware
```go
func TenancyMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Extract X-Tenant-ID header
        tenantID := c.GetHeader("X-Tenant-ID")
        
        // Validate tenant ID
        if tenantID == "" {
            c.AbortWithStatusJSON(400, gin.H{
                "error": "X-Tenant-ID header is required",
            })
            return
        }
        
        // Store in context
        c.Set("tenant_id", tenantID)
        c.Next()
    }
}
```

**Purpose**:
- Enforce tenant isolation
- Extract tenant ID từ header/JWT
- Validate tenant access
- Prevent cross-tenant access

### 6.7. Validation Layer (internal/validation/)

**Trách nhiệm**:
- Centralized input validation
- Sanitization functions
- Security-focused validation

**Key Functions**:

```go
// Email validation
func ValidateEmail(email string) error

// Name validation (with unicode support)
func ValidateName(name, fieldName string) error

// Phone validation (E.164 format)
func ValidatePhone(phone string) error

// ObjectID validation
func ValidateObjectID(id string) error

// String sanitization (XSS prevention)
func SanitizeString(s string) string
```

**Security Features**:
- Regex-based validation
- Unicode character support
- HTML/script tag removal
- Control character filtering

---

## 7. Bảo Mật và Quyền Riêng Tư

### 7.1. Chiến Lược Bảo Mật

#### 7.1.1. Multi-Layer Validation

**Layer 1: Handler (Format Validation)**
- Gin binding tags (`binding:"required,email"`)
- Basic format checks
- HTTP-specific validation

**Layer 2: Service (Business Validation)**
- Business rule enforcement
- Semantic validation
- Cross-field validation

**Layer 3: Repository (Data Constraints)**
- Database constraints
- Unique indexes
- Foreign key checks

#### 7.1.2. Injection Attack Prevention

**SQL/NoSQL Injection**:
- ✅ Use MongoDB driver parameterized queries
- ✅ Never concatenate user input into queries
- ✅ Validate all input data types

```go
// GOOD: Parameterized query
filter := bson.M{"email": userInput} 

// BAD: String concatenation (vulnerable)
// query := "SELECT * FROM users WHERE email = '" + userInput + "'"
```

**XSS Prevention**:
- ✅ Sanitize all user input
- ✅ Remove HTML tags and script content
- ✅ Escape output in responses
- ✅ Content-Type headers properly set

```go
func SanitizeString(s string) string {
    // Remove HTML tags
    s = stripHTMLTags(s)
    // Remove control characters
    s = removeControlChars(s)
    return strings.TrimSpace(s)
}
```

#### 7.1.3. Authentication & Authorization

**Architecture**:
```
Client → API Gateway (JWT validation) → User Service
         ↓
         Extract: user_id, tenant_id, roles
```

**User Service Role**:
- Không handle authentication (delegated to auth service)
- Receive tenant_id từ X-Tenant-ID header
- Validate tenant_id format
- Enforce tenant isolation

**Authorization**:
- Service-level: Kiểm tra tenant_id
- Feature-level: Check user permissions (future RBAC)

#### 7.1.4. Data Protection

**Encryption at Rest**:
- MongoDB encryption
- Sensitive field encryption (future)

**Encryption in Transit**:
- TLS 1.3 for all connections
- HTTPS only (no HTTP)
- gRPC with TLS

**Sensitive Data**:
- Email: Plain text (searchable) nhưng limited access
- Phone: Plain text (searchable)
- Password: KHÔNG lưu trong user service
- PII: Tagged for GDPR compliance

### 7.2. Audit Logging

**What to Log**:
- All CRUD operations
- Authentication attempts (future)
- Permission changes (future)
- Data exports (GDPR)
- Data deletions (GDPR)

**Log Format**:
```json
{
  "timestamp": "2024-12-27T10:30:00Z",
  "level": "info",
  "user_id": "user123",
  "tenant_id": "tenant456",
  "actor_id": "admin789",
  "action": "user.created",
  "resource": "users",
  "resource_id": "user123",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "changes": {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Retention**:
- Active logs: 7 years (compliance)
- Archived logs: Indefinite (compliance)
- PII anonymized on user deletion

### 7.3. Security Best Practices

**OWASP Top 10 Compliance**:
1. ✅ Injection: Parameterized queries
2. ✅ Broken Authentication: Delegated to auth service
3. ✅ Sensitive Data Exposure: Encryption, access control
4. ✅ XML External Entities: N/A (JSON API)
5. ✅ Broken Access Control: Tenant isolation
6. ✅ Security Misconfiguration: Secure defaults
7. ✅ XSS: Input sanitization
8. ✅ Insecure Deserialization: JSON parsing with validation
9. ✅ Using Components with Known Vulnerabilities: Dependency scanning
10. ✅ Insufficient Logging: Comprehensive audit logs

---

## 8. Khả Năng Mở Rộng

### 8.1. Horizontal Scaling

**Stateless Design**:
- Không lưu state trong memory
- JWT tokens (không session server-side)
- Request context isolation

**Load Balancing**:
```
        Load Balancer
        /     |     \
    Inst1  Inst2  Inst3
       \     |     /
        MongoDB Cluster
```

**Deployment**:
- Kubernetes với auto-scaling
- Min replicas: 2 (high availability)
- Max replicas: 10 (cost optimization)
- CPU-based scaling: > 70% → scale up

### 8.2. Database Scaling

**Read Replicas**:
- Primary: Write operations
- Secondaries: Read operations
- Read preference: "secondaryPreferred"

**Sharding Strategy**:
- Shard key: `tenant_id`
- Benefit: Tenant data co-located
- Optimal for multi-tenant queries

**Connection Pooling**:
```go
mongodb.Config{
    MaxPoolSize: 100, // Max connections
    MinPoolSize: 10,  // Min idle connections
}
```

### 8.3. Caching Strategy

**Cache Layers**:

**L1: Application Cache (In-Memory)**
- Rarely changing data (roles, permissions)
- TTL: 5 minutes
- Invalidation: On update

**L2: Distributed Cache (Redis)**
- User profiles (frequent access)
- Search results
- TTL: 15 minutes
- Invalidation: On update/delete

**Cache Patterns**:

```go
// Cache-aside pattern
func GetUser(id string) (*User, error) {
    // 1. Check cache
    if user := cache.Get("user:" + id); user != nil {
        return user, nil
    }
    
    // 2. Query database
    user, err := repo.FindByID(id)
    if err != nil {
        return nil, err
    }
    
    // 3. Store in cache
    cache.Set("user:" + id, user, 15*time.Minute)
    
    return user, nil
}

// Invalidate on update
func UpdateUser(user *User) error {
    err := repo.Update(user)
    if err != nil {
        return err
    }
    
    // Invalidate cache
    cache.Delete("user:" + user.ID)
    
    return nil
}
```

### 8.4. Performance Optimization

**Query Optimization**:
1. **Index Usage**: Explain plans để verify
2. **Projection**: Select only needed fields
3. **Pagination**: Limit result sets
4. **Aggregation**: Server-side processing

**Example Optimized Query**:
```go
// Instead of fetching all fields
var user User
err := collection.FindOne(ctx, filter).Decode(&user)

// Fetch only needed fields
projection := bson.M{
    "email": 1,
    "first_name": 1,
    "last_name": 1,
}
opts := options.FindOne().SetProjection(projection)
err := collection.FindOne(ctx, filter, opts).Decode(&user)
```

**Connection Management**:
- Connection pooling
- Keep-alive connections
- Graceful connection closing

**Response Optimization**:
- Pagination (limit page size)
- Field filtering (select specific fields)
- Compression (gzip)

### 8.5. Monitoring và Observability

**Metrics (Prometheus)**:
```
# Request metrics
http_requests_total{method="POST", endpoint="/users", status="201"}
http_request_duration_seconds{method="POST", endpoint="/users"}

# Database metrics
mongodb_connections_active
mongodb_operations_total{operation="insert"}
mongodb_operation_duration_seconds

# Business metrics
users_created_total{tenant_id="tenant123"}
users_deleted_total{tenant_id="tenant123"}
```

**Logging (Structured)**:
```go
logger.Info("User created",
    zap.String("user_id", user.ID),
    zap.String("tenant_id", user.TenantID),
    zap.String("email", user.Email),
    zap.Duration("duration", elapsed),
)
```

**Tracing (OpenTelemetry)**:
- Distributed tracing
- Request flow visualization
- Performance bottleneck identification

**Health Checks**:
```go
// Liveness probe (is service running?)
GET /health → 200 OK

// Readiness probe (is service ready?)
GET /ready → 200 OK (if DB connected)
```

---

## 9. Tuân Thủ GDPR

### 9.1. GDPR Requirements

**The General Data Protection Regulation (GDPR)** là quy định của EU về bảo vệ dữ liệu cá nhân.

**Các quyền của người dùng**:
1. **Right to Access**: Quyền truy cập dữ liệu cá nhân
2. **Right to Rectification**: Quyền sửa dữ liệu không chính xác
3. **Right to Erasure**: Quyền xóa dữ liệu ("Right to be Forgotten")
4. **Right to Data Portability**: Quyền xuất dữ liệu
5. **Right to Object**: Quyền phản đối xử lý dữ liệu
6. **Right to Restrict Processing**: Quyền hạn chế xử lý

### 9.2. Implementation

#### 9.2.1. Right to Access

**Feature**: Export User Data

```go
func (s *UserService) ExportUserData(ctx context.Context, userID, tenantID string) (*UserDataExport, error) {
    // 1. Get user profile
    user, _ := s.userRepo.FindByID(ctx, userID, tenantID)
    
    // 2. Get preferences
    prefs, _ := s.prefsRepo.FindByUserID(ctx, userID, tenantID)
    
    // 3. Get audit logs
    logs, _ := s.auditRepo.FindByUserID(ctx, userID, tenantID)
    
    // 4. Compile data export
    export := &UserDataExport{
        User:        user,
        Preferences: prefs,
        AuditLogs:   logs,
        ExportedAt:  time.Now(),
    }
    
    return export, nil
}
```

**API Endpoint**:
```
GET /api/v1/users/:id/export
Response: JSON with all user data
```

#### 9.2.2. Right to Erasure

**Feature**: Account Deletion with Grace Period

```go
func (s *UserService) RequestAccountDeletion(ctx context.Context, userID, tenantID string) error {
    // 1. Create deletion request
    request := &AccountDeletionRequest{
        UserID:       userID,
        TenantID:     tenantID,
        RequestedAt:  time.Now(),
        ScheduledFor: time.Now().Add(30 * 24 * time.Hour), // 30 days grace period
        Status:       "pending",
    }
    
    // 2. Store request
    s.deletionRepo.Create(ctx, request)
    
    // 3. Send notification (email)
    s.notifyDeletionScheduled(userID)
    
    return nil
}

func (s *UserService) ProcessAccountDeletion(ctx context.Context, requestID string) error {
    // 1. Get deletion request
    request, _ := s.deletionRepo.FindByID(ctx, requestID)
    
    // 2. Anonymize user data
    s.anonymizeUserData(ctx, request.UserID, request.TenantID)
    
    // 3. Anonymize audit logs (remove PII)
    s.anonymizeAuditLogs(ctx, request.UserID)
    
    // 4. Mark request as completed
    request.Status = "completed"
    request.ProcessedAt = time.Now()
    s.deletionRepo.Update(ctx, request)
    
    return nil
}
```

**Anonymization Strategy**:
```go
func (s *UserService) anonymizeUserData(ctx context.Context, userID, tenantID string) error {
    update := bson.M{
        "$set": bson.M{
            "email":      fmt.Sprintf("deleted-%s@anonymized.local", userID),
            "first_name": "Deleted",
            "last_name":  "User",
            "phone":      "",
            "avatar_url": "",
            "is_active":  false,
            "deleted_at": time.Now(),
        },
    }
    
    return s.userRepo.UpdateFields(ctx, userID, tenantID, update)
}
```

#### 9.2.3. Consent Management

**Feature**: Track User Consents

```go
type UserConsent struct {
    ID        primitive.ObjectID
    UserID    string
    TenantID  string
    Purpose   string    // "marketing", "analytics", "third_party"
    Granted   bool
    GrantedAt time.Time
    RevokedAt *time.Time
    IPAddress string
    UserAgent string
}

func (s *UserService) GrantConsent(ctx context.Context, userID, tenantID, purpose string) error {
    consent := &UserConsent{
        UserID:    userID,
        TenantID:  tenantID,
        Purpose:   purpose,
        Granted:   true,
        GrantedAt: time.Now(),
        IPAddress: ctx.Value("ip_address").(string),
        UserAgent: ctx.Value("user_agent").(string),
    }
    
    return s.consentRepo.Create(ctx, consent)
}
```

### 9.3. Data Minimization

**Principle**: Chỉ thu thập dữ liệu cần thiết

**Applied in User Service**:
- ✅ Email: Required (identifier)
- ✅ First/Last Name: Required (basic profile)
- ✅ Tenant ID: Required (multi-tenancy)
- ✅ Phone: Optional
- ✅ Avatar URL: Optional
- ❌ Address: Not stored (not needed)
- ❌ SSN: Not stored (sensitive, not needed)
- ❌ Credit Card: Not stored (payment service handles)

### 9.4. Privacy by Design

**Principles Applied**:

1. **Proactive not Reactive**
   - Privacy considered from design phase
   - Default to secure settings

2. **Privacy as Default**
   - is_active defaults to true, but requires explicit creation
   - Consents must be explicitly granted

3. **Privacy Embedded into Design**
   - Soft delete instead of hard delete
   - Audit logging built-in
   - Tenant isolation at database level

4. **Full Functionality**
   - Privacy không ảnh hưởng functionality
   - User experience maintained

5. **End-to-End Security**
   - Encryption at rest and in transit
   - Access control at all layers

6. **Visibility and Transparency**
   - Users can export their data
   - Audit logs show all operations
   - Clear data retention policies

7. **Respect for User Privacy**
   - User control over their data
   - Easy opt-out mechanisms
   - Clear consent management

### 9.5. Data Retention Policy

**Policy**:

| Data Type | Retention Period | Reason |
|-----------|------------------|---------|
| User Profile (Active) | Indefinite | Business need |
| User Profile (Deleted) | 30 days then anonymized | Grace period + compliance |
| Audit Logs | 7 years | Legal compliance |
| Session Data | 30 days | Security |
| Backups | 30 days | Disaster recovery |

**Implementation**:
```go
// TTL Index for session cleanup
indexes := []mongo.IndexModel{
    {
        Keys: bson.D{{Key: "expires_at", Value: 1}},
        Options: options.Index().SetExpireAfterSeconds(0),
    },
}
```

---

## Kết Luận

Tài liệu này cung cấp cái nhìn toàn diện về phân tích và thiết kế của **Go User Service**. Hệ thống được thiết kế với các nguyên tắc:

- ✅ **Clean Architecture**: Tách biệt rõ ràng các layers
- ✅ **Multi-Tenancy**: Cô lập dữ liệu giữa các thuê bao
- ✅ **Security First**: Bảo mật được tích hợp từ thiết kế
- ✅ **GDPR Compliance**: Tuân thủ quy định bảo vệ dữ liệu
- ✅ **Scalable**: Hỗ trợ mở rộng ngang và dọc
- ✅ **Maintainable**: Code sạch, có test coverage cao
- ✅ **Observable**: Logging, metrics, tracing đầy đủ

**Tài liệu liên quan**:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Kiến trúc chi tiết (English)
- [API.md](API.md) - API documentation
- [GDPR_COMPLIANCE.md](GDPR_COMPLIANCE.md) - GDPR implementation
- [diagrams/](diagrams/) - PlantUML diagrams

**Version**: 1.0  
**Last Updated**: December 2024  
**Author**: VHVCorp Development Team
