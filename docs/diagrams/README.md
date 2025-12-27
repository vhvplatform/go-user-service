# PlantUML Diagrams - User Service

Thư mục này chứa các sơ đồ PlantUML mô tả kiến trúc và thiết kế của User Service.

## Tổng Quan

PlantUML là một công cụ mã nguồn mở cho phép tạo sơ đồ UML từ mô tả văn bản đơn giản. Các sơ đồ trong thư mục này có thể được render thành hình ảnh bằng nhiều công cụ khác nhau.

## Danh Sách Sơ Đồ

### Sơ Đồ Kiến Trúc Mới (Vietnamese Documentation)

1. **system-overview.puml** - Sơ đồ tổng quan hệ thống
   - Mô tả kiến trúc tổng thể của User Service
   - Hiển thị các thành phần chính và mối quan hệ giữa chúng
   - Bao gồm: API Gateway, HTTP/gRPC APIs, Services, Repositories, Databases, Cache, Monitoring

2. **class-diagram.puml** - Sơ đồ lớp chi tiết
   - Mô tả các class và interface trong hệ thống
   - Hiển thị quan hệ giữa Domain, Repository, Service, và Handler layers
   - Bao gồm: User, UserPreferences, Repositories, Services, Handlers, DTOs

3. **component-diagram.puml** - Sơ đồ thành phần
   - Mô tả các component và dependencies
   - Hiển thị cách các module tương tác với nhau
   - Bao gồm: HTTP Interface, gRPC Interface, Middleware, Services, Repositories, External Services

4. **data-flow.puml** - Sơ đồ luồng dữ liệu
   - Mô tả các use case chính với sequence diagrams
   - Bao gồm: Create User, Get User (with cache), Search Users, Update User, Delete User flows

5. **deployment-diagram.puml** - Sơ đồ triển khai
   - Mô tả infrastructure và deployment architecture
   - Bao gồm: Kubernetes cluster, MongoDB cluster, Redis cluster, Load balancers, Monitoring stack

6. **architecture-layers.puml** - Sơ đồ kiến trúc phân lớp
   - Mô tả Clean Architecture pattern chi tiết
   - Hiển thị Dependency Rule và các layers: External, Adapters, Use Cases, Entities

### Sơ Đồ Hiện Có

7. **database-schema.puml** - Database schema và collections
8. **gdpr-compliance.puml** - GDPR compliance flows
9. **user-lifecycle.puml** - User lifecycle states
10. **user-search.puml** - Search functionality
11. **profile-management.puml** - Profile management flows
12. **password-management.puml** - Password management (if applicable)
13. **rbac-architecture.puml** - Role-based access control

## Cách Xem Sơ Đồ

### 1. Online Viewer

Cách nhanh nhất để xem sơ đồ:

**PlantUML Online Server:**
- Truy cập: http://www.plantuml.com/plantuml/uml/
- Copy-paste nội dung file .puml
- Click "Submit" để render

**GitHub:**
- Một số GitHub viewers có thể render PlantUML trực tiếp
- Ví dụ: VS Code với PlantUML extension

### 2. VS Code Extension

Cài đặt extension "PlantUML" cho VS Code:

```bash
# Tìm và cài đặt extension
code --install-extension jebbs.plantuml
```

**Yêu cầu:**
- Java Runtime Environment (JRE)
- GraphViz (optional, for better rendering)

**Cách sử dụng:**
1. Mở file .puml trong VS Code
2. Press `Alt+D` để preview
3. Hoặc right-click → "Preview Current Diagram"

### 3. Command Line

**Cài đặt PlantUML:**

```bash
# Ubuntu/Debian
sudo apt-get install plantuml

# macOS with Homebrew
brew install plantuml

# Or download JAR file directly
wget https://github.com/plantuml/plantuml/releases/download/v1.2023.13/plantuml-1.2023.13.jar -O plantuml.jar
```

**Generate PNG images:**

```bash
# Single file
plantuml docs/diagrams/system-overview.puml

# All diagrams
plantuml docs/diagrams/*.puml

# Specify output format
plantuml -tsvg docs/diagrams/system-overview.puml  # SVG
plantuml -tpng docs/diagrams/system-overview.puml  # PNG
```

**Generate to specific directory:**

```bash
plantuml -o ../../images docs/diagrams/*.puml
```

### 4. Docker

```bash
# Run PlantUML server locally
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty

# Access at http://localhost:8080
```

### 5. IntelliJ IDEA / GoLand

1. Install "PlantUML integration" plugin
2. Open .puml file
3. View will appear on the right side panel

## Makefile Commands (Optional)

Thêm vào Makefile để generate diagrams:

```makefile
.PHONY: diagrams

diagrams: ## Generate PNG images from PlantUML diagrams
	@echo "Generating diagrams..."
	@mkdir -p docs/images
	@plantuml -tpng -o ../images docs/diagrams/*.puml
	@echo "Diagrams generated in docs/images/"

diagrams-svg: ## Generate SVG images from PlantUML diagrams
	@echo "Generating SVG diagrams..."
	@mkdir -p docs/images
	@plantuml -tsvg -o ../images docs/diagrams/*.puml
	@echo "SVG diagrams generated in docs/images/"
```

## Cấu Trúc Sơ Đồ

Các sơ đồ được tổ chức theo các loại sau:

### Architecture Diagrams (Kiến trúc)
- `system-overview.puml` - Overall system architecture
- `component-diagram.puml` - Component relationships
- `architecture-layers.puml` - Clean Architecture layers

### Behavioral Diagrams (Hành vi)
- `data-flow.puml` - Sequence diagrams for main flows
- `user-lifecycle.puml` - State transitions

### Structural Diagrams (Cấu trúc)
- `class-diagram.puml` - Class structure and relationships
- `database-schema.puml` - Database collections and relationships

### Deployment Diagrams (Triển khai)
- `deployment-diagram.puml` - Infrastructure and deployment

## Tips

### Syntax Highlighting

Để có syntax highlighting tốt hơn trong editor:
- VS Code: Install PlantUML extension
- Vim: Use plantuml-syntax plugin
- IntelliJ: Built-in support

### Best Practices

1. **Keep diagrams focused**: Mỗi diagram nên tập trung vào một khía cạnh cụ thể
2. **Use consistent naming**: Đặt tên component giống như trong code
3. **Add notes**: Giải thích các quyết định thiết kế quan trọng
4. **Version control**: Commit diagrams cùng với code changes
5. **Update regularly**: Cập nhật diagrams khi architecture thay đổi

### Styling

PlantUML hỗ trợ nhiều options để customize diagrams:

```plantuml
' Change colors
skinparam backgroundColor #EEEBDC
skinparam handwritten true

' Font
skinparam defaultFontName Arial
skinparam defaultFontSize 12

' Components
skinparam component {
    BackgroundColor LightBlue
    BorderColor Black
}
```

## Tài Liệu Tham Khảo

- **PlantUML Official**: https://plantuml.com/
- **PlantUML Guide**: https://plantuml.com/guide
- **Syntax Reference**: https://plantuml.com/sitemap-language-specification
- **Examples**: https://real-world-plantuml.com/

## Export Options

PlantUML hỗ trợ nhiều format output:

| Format | Command | Use Case |
|--------|---------|----------|
| PNG | `-tpng` | Documentation, presentations |
| SVG | `-tsvg` | Web, scalable graphics |
| EPS | `-teps` | Publications, high quality |
| PDF | `-tpdf` | Documents, printing |
| LaTeX | `-tlatex` | Academic papers |
| ASCII Art | `-ttxt` | Text documents, emails |

## Troubleshooting

### Diagram không render

1. **Kiểm tra syntax**: Sử dụng online editor để validate
2. **Kiểm tra Java**: PlantUML cần Java Runtime
3. **Memory issues**: Increase Java heap size
   ```bash
   export PLANTUML_LIMIT_SIZE=8192
   ```

### Diagram quá lớn

1. Split thành nhiều diagrams nhỏ hơn
2. Sử dụng `!include` để modularize
3. Hide implementation details với `!define`

### Font issues

```bash
# Install required fonts
sudo apt-get install fonts-liberation
```

## Contributing

Khi thêm hoặc cập nhật diagrams:

1. Follow existing naming conventions
2. Add description trong file này
3. Test rendering trước khi commit
4. Update relevant documentation
5. Consider adding notes to explain complex parts

## License

Các diagrams này là một phần của go-user-service project và tuân theo cùng license (MIT).

---

**Last Updated**: December 2024  
**Maintainer**: VHVCorp Development Team
