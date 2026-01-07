# Hướng Dẫn Cấu Trúc Mới - Repository go-user-service

## Tổng Quan

Repository đã được tổ chức lại để hỗ trợ phát triển đa nền tảng với các thư mục riêng biệt cho backend, frontend và ứng dụng mobile.

## Cấu Trúc Mới

```
go-user-service/
├── server/              # Backend microservice (Golang)
│   ├── cmd/            # Điểm khởi động ứng dụng
│   ├── internal/       # Các package nội bộ
│   ├── proto/          # Protocol buffers
│   ├── docs/           # Tài liệu Swagger
│   ├── go.mod          # Go module
│   ├── Dockerfile      # Cấu hình Docker
│   ├── Makefile        # Build scripts
│   └── *.bat           # Windows batch scripts
│
├── client/             # Ứng dụng web frontend (ReactJS)
│   └── README.md       # Tài liệu frontend
│
├── flutter/            # Ứng dụng mobile (Flutter)
│   └── README.md       # Tài liệu mobile app
│
├── docs/               # Tài liệu dự án
│   ├── architecture/   # Tài liệu kiến trúc
│   ├── windows/        # Tài liệu cho Windows
│   ├── diagrams/       # Biểu đồ PlantUML
│   └── ...
│
└── README.md           # README chính của dự án
```

## Những Thay Đổi

### Backend (Golang)
- **Trước**: Tất cả file backend ở thư mục gốc
- **Sau**: Tất cả file backend chuyển vào thư mục `server/`
  - Mã nguồn Go: `server/cmd/`, `server/internal/`
  - File build: `server/Makefile`, `server/Dockerfile`, `server/*.bat`
  - Cấu hình: `server/.env.example`, `server/.air.toml`
  - Tài liệu Swagger: `server/docs/`

### Tài Liệu
- **Trước**: Tài liệu nằm rải rác ở thư mục gốc và trong `docs/`
- **Sau**: Tất cả tài liệu được tổ chức trong `docs/` với các thư mục con
  - `docs/architecture/` - Tài liệu kiến trúc và thiết kế
  - `docs/windows/` - Hướng dẫn phát triển trên Windows
  - `docs/diagrams/` - Biểu đồ PlantUML

### Frontend & Mobile
- **Mới**: Tạo thư mục `client/` cho ReactJS frontend (chưa có code)
- **Mới**: Tạo thư mục `flutter/` cho Flutter mobile app (chưa có code)

## Lệnh Checkout

### Nếu bạn đã có repository:

```bash
# Chuyển sang nhánh mới
git fetch origin
git checkout copilot/update-repository-structure
```

### Nếu bạn clone lần đầu:

```bash
# Clone repository và checkout nhánh mới
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service
git checkout copilot/update-repository-structure
```

## Hướng Dẫn Phát Triển

### Backend (Golang)

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
go mod download

# Chạy server
go run cmd/main.go

# Hoặc dùng Makefile
make run

# Hoặc dùng batch script trên Windows
run.bat

# Build
make build

# Run tests
make test
```

### Frontend (ReactJS) - Sẽ phát triển

```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Build production
npm run build
```

### Mobile (Flutter) - Sẽ phát triển

```bash
# Di chuyển vào thư mục flutter
cd flutter

# Cài đặt dependencies
flutter pub get

# Chạy app
flutter run

# Build
flutter build apk  # Android
flutter build ios  # iOS
```

## Kiểm Tra

Sau khi checkout nhánh mới:

```bash
# Kiểm tra server build được
cd server
go mod tidy
go build -o bin/user-service ./cmd/main.go

# Chạy tests
go test ./...

# Chạy service
go run cmd/main.go
```

## Lợi Ích Của Cấu Trúc Mới

1. **Phân Tách Rõ Ràng**: Mỗi nền tảng (backend, frontend, mobile) có thư mục riêng
2. **Khả Năng Mở Rộng**: Dễ dàng thêm nền tảng hoặc service mới
3. **Tổ Chức Tài Liệu**: Phân loại tốt hơn với các thư mục con
4. **Dễ Onboard**: Developer mới có thể nhanh chóng hiểu cấu trúc dự án
5. **Phát Triển Đa Nền Tảng**: Các team có thể làm việc độc lập trên các nền tảng khác nhau

## Bước Tiếp Theo

1. **Phát Triển Frontend**: Thêm code ReactJS vào `client/`
2. **Phát Triển Mobile**: Thêm code Flutter vào `flutter/`
3. **Cập Nhật CI/CD**: Cập nhật build pipeline cho cấu trúc mới
4. **Tài Liệu**: Thêm hướng dẫn chi tiết cho từng nền tảng

## Tài Liệu Chi Tiết

- [README chính](../README.md) - Tổng quan dự án
- [Restructure Guide (English)](RESTRUCTURE_GUIDE.md) - Hướng dẫn chi tiết bằng tiếng Anh
- [Architecture](architecture/ARCHITECTURE.md) - Kiến trúc hệ thống
- [API Documentation](API.md) - Tài liệu API

## Hỗ Trợ

Nếu gặp vấn đề với cấu trúc mới:
- Xem hướng dẫn này
- Đọc [README.md](../README.md) chính
- Mở issue trên [GitHub Issues](https://github.com/vhvplatform/go-user-service/issues)
