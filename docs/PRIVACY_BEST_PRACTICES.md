# Privacy Best Practices

## Overview

This document outlines privacy best practices for developing and maintaining the User Service. These guidelines ensure user data is handled responsibly, securely, and in compliance with privacy regulations.

## Table of Contents

1. [Privacy by Design](#privacy-by-design)
2. [Data Collection](#data-collection)
3. [Data Storage](#data-storage)
4. [Data Access](#data-access)
5. [Data Sharing](#data-sharing)
6. [User Communication](#user-communication)
7. [Security Practices](#security-practices)
8. [Development Guidelines](#development-guidelines)

## Privacy by Design

### Proactive Not Reactive
- **Anticipate privacy risks** before they occur
- **Implement privacy controls** at the design stage
- **Regular privacy assessments** during development
- **Privacy by default** settings for all features

### Privacy as the Default Setting
```go
// Example: Privacy-friendly defaults
type UserPreferences struct {
    EmailNotifications    bool   `json:"email_notifications" default:"false"`
    MarketingEmails       bool   `json:"marketing_emails" default:"false"`
    DataSharing           bool   `json:"data_sharing" default:"false"`
    ProfileVisibility     string `json:"profile_visibility" default:"private"`
    ActivityTracking      bool   `json:"activity_tracking" default:"false"`
}
```

### Full Functionality – Positive-Sum
- Privacy protection doesn't reduce functionality
- Both business goals and privacy can be achieved
- User trust increases engagement
- Transparent data practices build loyalty

### End-to-End Security
- **Lifecycle protection**: Design to deletion
- **All touchpoints secured**: APIs, databases, backups
- **Defense in depth**: Multiple security layers
- **Regular security audits**

### Visibility and Transparency
```go
// Example: Transparent audit logging
func (s *UserService) CreateUser(ctx context.Context, req *CreateUserRequest) (*User, error) {
    // Log the action for transparency
    s.auditLog.Log(AuditEvent{
        Action:    "user.create",
        ActorID:   req.CreatedBy,
        Timestamp: time.Now(),
        Details: map[string]interface{}{
            "email": req.Email,
            "tenant_id": req.TenantID,
        },
    })
    
    // ... business logic
}
```

### Respect for User Privacy
- **User-centric approach** in all decisions
- **Clear communication** about data use
- **Easy privacy controls** for users
- **Honor user preferences** consistently

## Data Collection

### Minimize Data Collection

**Principle**: Collect only what you need.

**Guidelines:**
```go
// ❌ Bad: Collecting unnecessary data
type UserProfile struct {
    Email           string
    FullName        string
    DateOfBirth     string  // Not needed for core functionality
    SocialSecurity  string  // Never collect unless absolutely required
    HomeAddress     string  // Collect only if shipping is needed
    Income          int     // Unnecessary for most services
}

// ✅ Good: Minimal necessary data
type UserProfile struct {
    Email       string  // Required for authentication
    FirstName   string  // Useful for personalization
    LastName    string  // Useful for identification
    Phone       string  `json:"phone,omitempty"` // Optional
}
```

**Questions to Ask:**
- Is this field necessary for core functionality?
- Can we achieve the same goal with less data?
- Can this be optional instead of required?
- Can we derive this from existing data?

### Informed Consent

**Always obtain explicit consent** before collecting personal data:

```go
type ConsentRequest struct {
    Purpose     string    `json:"purpose" validate:"required"`
    Description string    `json:"description" validate:"required"`
    Granted     bool      `json:"granted" validate:"required"`
    UserID      string    `json:"user_id"`
    IPAddress   string    `json:"ip_address"`
    UserAgent   string    `json:"user_agent"`
    Timestamp   time.Time `json:"timestamp"`
}

// Example usage
func (s *UserService) RequestConsent(ctx context.Context, req *ConsentRequest) error {
    // Validate consent request
    if err := s.validator.Validate(req); err != nil {
        return err
    }
    
    // Store consent with context
    return s.consentRepo.Create(ctx, &Consent{
        UserID:      req.UserID,
        Purpose:     req.Purpose,
        Description: req.Description,
        Granted:     req.Granted,
        GrantedAt:   time.Now(),
        IPAddress:   req.IPAddress,
        UserAgent:   req.UserAgent,
    })
}
```

### Purpose Specification

**Be specific about why data is collected:**

```json
{
  "data_collection_purposes": {
    "email": "User authentication and account recovery",
    "name": "Personalization and user identification",
    "phone": "Two-factor authentication and account security",
    "avatar": "Profile customization and user recognition",
    "preferences": "Service customization and user experience"
  }
}
```

### Age Verification

**Protect children's privacy:**

```go
const MinimumAge = 13 // Adjust based on jurisdiction (COPPA, GDPR)

func ValidateAge(dateOfBirth time.Time) error {
    age := time.Now().Year() - dateOfBirth.Year()
    if age < MinimumAge {
        return errors.New("user must be at least 13 years old")
    }
    return nil
}
```

## Data Storage

### Encryption at Rest

**Encrypt sensitive data:**

```go
// Example: Encrypting sensitive fields
type User struct {
    ID        string
    Email     string // Encrypted
    FirstName string
    LastName  string
    Phone     string // Encrypted
    SSN       string // Encrypted with additional protection
}

func (u *User) BeforeSave() error {
    // Encrypt email
    encryptedEmail, err := encrypt(u.Email)
    if err != nil {
        return err
    }
    u.Email = encryptedEmail
    
    // Encrypt phone
    encryptedPhone, err := encrypt(u.Phone)
    if err != nil {
        return err
    }
    u.Phone = encryptedPhone
    
    return nil
}
```

**Encryption Guidelines:**
- Use **AES-256** for symmetric encryption
- Use **RSA-2048** or higher for asymmetric encryption
- Store encryption keys in **secure key management system**
- Rotate keys regularly
- Never hardcode encryption keys

### Data Masking

**Mask sensitive data in logs and displays:**

```go
func MaskEmail(email string) string {
    parts := strings.Split(email, "@")
    if len(parts) != 2 {
        return "***@***"
    }
    
    username := parts[0]
    domain := parts[1]
    
    if len(username) <= 2 {
        return "**@" + domain
    }
    
    return username[:2] + "***@" + domain
}

func MaskPhone(phone string) string {
    if len(phone) < 4 {
        return "****"
    }
    return "******" + phone[len(phone)-4:]
}

// Usage in logs
log.Info("User logged in", 
    zap.String("email", MaskEmail(user.Email)),
    zap.String("user_id", user.ID),
)
```

### Secure Backups

**Protect backup data:**
- Encrypt all backups
- Store backups in secure, separate location
- Implement backup retention policies
- Test backup restoration regularly
- Limit access to backup data

### Data Retention

**Implement clear retention policies:**

```go
type RetentionPolicy struct {
    DataType        string
    RetentionPeriod time.Duration
    DeleteAfter     bool
    AnonymizeAfter  bool
}

var RetentionPolicies = []RetentionPolicy{
    {
        DataType:        "active_user_profile",
        RetentionPeriod: 0, // Indefinite while active
        DeleteAfter:     false,
        AnonymizeAfter:  false,
    },
    {
        DataType:        "inactive_user_profile",
        RetentionPeriod: 2 * 365 * 24 * time.Hour, // 2 years
        DeleteAfter:     true,
        AnonymizeAfter:  false,
    },
    {
        DataType:        "audit_logs",
        RetentionPeriod: 7 * 365 * 24 * time.Hour, // 7 years
        DeleteAfter:     true,
        AnonymizeAfter:  true, // Anonymize PII after deletion
    },
    {
        DataType:        "session_data",
        RetentionPeriod: 90 * 24 * time.Hour, // 90 days
        DeleteAfter:     true,
        AnonymizeAfter:  false,
    },
}
```

## Data Access

### Access Control

**Implement strict access controls:**

```go
// Role-based access control
type Permission struct {
    Resource string // e.g., "users"
    Action   string // e.g., "read", "write", "delete"
}

type Role struct {
    Name        string
    Permissions []Permission
}

var Roles = map[string]Role{
    "user": {
        Name: "user",
        Permissions: []Permission{
            {Resource: "users", Action: "read"}, // Own profile only
            {Resource: "users", Action: "write"}, // Own profile only
        },
    },
    "admin": {
        Name: "admin",
        Permissions: []Permission{
            {Resource: "users", Action: "read"},
            {Resource: "users", Action: "write"},
            {Resource: "users", Action: "delete"},
        },
    },
}

// Middleware to check permissions
func RequirePermission(resource, action string) gin.HandlerFunc {
    return func(c *gin.Context) {
        user := GetCurrentUser(c)
        
        if !user.HasPermission(resource, action) {
            c.JSON(403, gin.H{"error": "Insufficient permissions"})
            c.Abort()
            return
        }
        
        c.Next()
    }
}
```

### Audit Logging

**Log all data access:**

```go
type AuditLog struct {
    ID          string
    ActorID     string
    ActorType   string // "user", "admin", "system"
    Action      string // "read", "write", "delete", "export"
    Resource    string
    ResourceID  string
    TenantID    string
    IPAddress   string
    UserAgent   string
    Success     bool
    ErrorMsg    string
    Timestamp   time.Time
    Changes     map[string]interface{}
}

// Example: Audit user data access
func (s *UserService) GetUser(ctx context.Context, userID string) (*User, error) {
    actorID := GetActorID(ctx)
    
    // Log the access attempt
    defer s.auditLog.Log(AuditLog{
        ActorID:    actorID,
        Action:     "read",
        Resource:   "user",
        ResourceID: userID,
        Timestamp:  time.Now(),
        IPAddress:  GetIPAddress(ctx),
        UserAgent:  GetUserAgent(ctx),
    })
    
    // Fetch user
    user, err := s.userRepo.FindByID(ctx, userID)
    if err != nil {
        return nil, err
    }
    
    return user, nil
}
```

### Principle of Least Privilege

**Grant minimum necessary access:**
- Users can only access their own data
- Admins have limited scope within tenant
- Service accounts have specific permissions
- Regular review of access rights
- Automatic access revocation on role change

## Data Sharing

### Third-Party Sharing

**Minimize and control third-party access:**

```go
type ThirdPartyIntegration struct {
    Name            string
    Purpose         string
    DataShared      []string
    ConsentRequired bool
    DPA             string // Data Processing Agreement reference
    Enabled         bool
}

// Example: Email service integration
var EmailService = ThirdPartyIntegration{
    Name:            "SendGrid",
    Purpose:         "Transactional emails",
    DataShared:      []string{"email", "name"},
    ConsentRequired: false, // Required for service
    DPA:             "DPA-2024-001",
    Enabled:         true,
}

var AnalyticsService = ThirdPartyIntegration{
    Name:            "Google Analytics",
    Purpose:         "Usage analytics",
    DataShared:      []string{"user_id", "events"},
    ConsentRequired: true, // Requires explicit consent
    DPA:             "DPA-2024-002",
    Enabled:         true,
}
```

### Data Processing Agreements

**Requirements for third-party processors:**
- Signed Data Processing Agreement (DPA)
- GDPR compliance certification
- Security audit results
- Data breach notification procedures
- Sub-processor disclosure
- Right to audit

### Cross-Border Transfers

**For data transfers outside EU:**
```go
type DataTransfer struct {
    FromCountry     string
    ToCountry       string
    LegalMechanism  string // "Adequacy Decision", "SCC", "BCR"
    Approved        bool
    ApprovalDate    time.Time
}

// Example: Transfer to US (if approved)
var USTransfer = DataTransfer{
    FromCountry:    "EU",
    ToCountry:      "US",
    LegalMechanism: "Standard Contractual Clauses",
    Approved:       true,
    ApprovalDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
}
```

## User Communication

### Transparency

**Be transparent about data practices:**

```markdown
# Privacy Notice Example

## What data we collect
- Email address (for authentication)
- Name (for personalization)
- Usage data (for service improvement)

## Why we collect it
- To provide and improve our service
- To communicate with you
- To ensure security

## Who we share it with
- We don't sell your data
- We share with service providers (email, hosting)
- We may share if legally required

## Your rights
- Access your data
- Correct your data
- Delete your data
- Export your data
- Object to processing

## Contact us
privacy@vhvplatform.com
```

### Clear Privacy Policy

**Privacy policy requirements:**
- Written in plain language
- Easy to find and access
- Comprehensive coverage of practices
- Updated regularly
- Version history maintained
- Users notified of changes

### Just-in-Time Notices

**Provide context-specific privacy information:**

```go
// Example: Show privacy notice at data collection point
type DataCollectionNotice struct {
    Field       string
    Purpose     string
    Required    bool
    SharedWith  []string
}

var ProfilePhotoNotice = DataCollectionNotice{
    Field:      "avatar",
    Purpose:    "Display your profile picture to other users",
    Required:   false,
    SharedWith: []string{"Other users in your organization"},
}
```

## Security Practices

### Input Validation

**Validate and sanitize all inputs:**

```go
import "github.com/go-playground/validator/v10"

type CreateUserRequest struct {
    Email     string `json:"email" validate:"required,email"`
    FirstName string `json:"first_name" validate:"required,min=1,max=100,alphaunicode"`
    LastName  string `json:"last_name" validate:"required,min=1,max=100,alphaunicode"`
    Phone     string `json:"phone,omitempty" validate:"omitempty,e164"`
}

func (r *CreateUserRequest) Sanitize() {
    // Trim whitespace
    r.Email = strings.TrimSpace(r.Email)
    r.FirstName = strings.TrimSpace(r.FirstName)
    r.LastName = strings.TrimSpace(r.LastName)
    
    // Remove potentially dangerous characters
    r.FirstName = sanitizeAlphanumeric(r.FirstName)
    r.LastName = sanitizeAlphanumeric(r.LastName)
}
```

### SQL Injection Prevention

**Use parameterized queries:**

```go
// ✅ Good: Parameterized query
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
    var user User
    err := r.collection.FindOne(ctx, bson.M{
        "email": email, // MongoDB automatically parameterizes
    }).Decode(&user)
    return &user, err
}

// ❌ Bad: String concatenation (never do this)
// query := "SELECT * FROM users WHERE email = '" + email + "'"
```

### XSS Protection

**Sanitize output:**

```go
import "html"

func SanitizeHTML(input string) string {
    return html.EscapeString(input)
}

// Use in responses
type UserResponse struct {
    ID        string `json:"id"`
    FirstName string `json:"first_name"`
    LastName  string `json:"last_name"`
}

func (u *User) ToResponse() UserResponse {
    return UserResponse{
        ID:        u.ID,
        FirstName: SanitizeHTML(u.FirstName),
        LastName:  SanitizeHTML(u.LastName),
    }
}
```

### Password Security

**Strong password requirements:**

```go
func ValidatePassword(password string) error {
    if len(password) < 8 {
        return errors.New("password must be at least 8 characters")
    }
    
    hasUpper := false
    hasLower := false
    hasDigit := false
    hasSpecial := false
    
    for _, char := range password {
        switch {
        case unicode.IsUpper(char):
            hasUpper = true
        case unicode.IsLower(char):
            hasLower = true
        case unicode.IsDigit(char):
            hasDigit = true
        case unicode.IsPunct(char) || unicode.IsSymbol(char):
            hasSpecial = true
        }
    }
    
    if !hasUpper || !hasLower || !hasDigit || !hasSpecial {
        return errors.New("password must contain uppercase, lowercase, digit, and special character")
    }
    
    // Check against common passwords
    if isCommonPassword(password) {
        return errors.New("password is too common")
    }
    
    return nil
}
```

## Development Guidelines

### Code Review Checklist

**Privacy considerations in code review:**
- [ ] No sensitive data in logs
- [ ] Proper input validation
- [ ] Data minimization applied
- [ ] Encryption for sensitive data
- [ ] Access controls implemented
- [ ] Audit logging included
- [ ] Error messages don't leak information
- [ ] No hardcoded credentials or keys

### Testing

**Include privacy in testing:**

```go
// Test data anonymization
func TestUserDeletion_AnonymizesData(t *testing.T) {
    user := createTestUser()
    
    err := userService.DeleteUser(context.Background(), user.ID)
    assert.NoError(t, err)
    
    deletedUser, _ := userRepo.FindByID(context.Background(), user.ID)
    assert.Equal(t, "[DELETED]", deletedUser.FirstName)
    assert.Equal(t, "[DELETED]", deletedUser.LastName)
    assert.True(t, strings.HasPrefix(deletedUser.Email, "deleted_"))
    assert.Empty(t, deletedUser.Phone)
}

// Test consent enforcement
func TestMarketingEmail_RequiresConsent(t *testing.T) {
    user := createTestUser()
    
    // User hasn't granted marketing consent
    err := emailService.SendMarketingEmail(user.Email)
    assert.Error(t, err)
    assert.Contains(t, err.Error(), "consent required")
}
```

### Documentation

**Document privacy decisions:**

```go
// PII - Personal Identifiable Information
// This field contains user email which is considered PII.
// - Encrypted at rest using AES-256
// - Masked in logs
// - Requires explicit consent for marketing use
// - Included in data export requests
// - Anonymized upon account deletion
type User struct {
    Email string `json:"email" bson:"email,encrypted" pii:"true"`
}
```

## Resources

### Internal
- [GDPR Compliance Guide](GDPR_COMPLIANCE.md)
- [Security Policy](SECURITY_POLICY.md)
- [Incident Response Plan](INCIDENT_RESPONSE.md)

### External
- [OWASP Privacy Risks](https://owasp.org/www-project-top-10-privacy-risks/)
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
- [Privacy by Design Principles](https://www.ipc.on.ca/wp-content/uploads/Resources/7foundationalprinciples.pdf)

---

**Remember**: Privacy is not a feature, it's a fundamental right. Every decision should prioritize user privacy.

**Last Updated**: December 2024  
**Version**: 1.0
