# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go.work and modules
COPY go.work go.work
COPY pkg/go.mod pkg/go.sum pkg/
COPY services/user-service/go.mod services/user-service/go.sum services/user-service/

# Download dependencies
WORKDIR /app/services/user-service
RUN go mod download

# Copy source code
WORKDIR /app
COPY pkg/ pkg/
COPY services/user-service/ services/user-service/

# Build the application
WORKDIR /app/services/user-service
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/bin/user-service ./cmd/main.go

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/bin/user-service .

# Expose ports
EXPOSE 50052 8082

CMD ["./user-service"]
