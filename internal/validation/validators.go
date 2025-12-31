package validation

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"
)

var (
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	phoneRegex = regexp.MustCompile(`^\+?[1-9]\d{5,13}$`) // E.164 format: 7-15 digits total (first digit 1-9, then 5-13 more)
)

// ValidateEmail validates email format
func ValidateEmail(email string) error {
	email = strings.TrimSpace(email)
	if email == "" {
		return fmt.Errorf("email is required")
	}
	if len(email) > 255 {
		return fmt.Errorf("email is too long (max 255 characters)")
	}
	if !emailRegex.MatchString(email) {
		return fmt.Errorf("invalid email format")
	}
	return nil
}

// ValidateName validates first name or last name
func ValidateName(name, fieldName string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return fmt.Errorf("%s is required", fieldName)
	}
	if len(name) < 1 || len(name) > 100 {
		return fmt.Errorf("%s must be between 1 and 100 characters", fieldName)
	}

	// Check for invalid characters (allow unicode letters, spaces, hyphens, apostrophes)
	for _, r := range name {
		if !unicode.IsLetter(r) && !unicode.IsSpace(r) && r != '-' && r != '\'' {
			return fmt.Errorf("%s contains invalid characters", fieldName)
		}
	}

	return nil
}

// ValidatePhone validates phone number in E.164 format
func ValidatePhone(phone string) error {
	if phone == "" {
		return nil // Phone is optional
	}

	phone = strings.TrimSpace(phone)
	if !phoneRegex.MatchString(phone) {
		return fmt.Errorf("invalid phone number format (E.164 format required, e.g., +1234567890)")
	}

	return nil
}

// SanitizeString removes potentially dangerous characters
func SanitizeString(input string) string {
	// Trim whitespace
	input = strings.TrimSpace(input)

	// Remove control characters
	var sanitized strings.Builder
	for _, r := range input {
		if !unicode.IsControl(r) {
			sanitized.WriteRune(r)
		}
	}

	return sanitized.String()
}

// SanitizeName sanitizes user names
func SanitizeName(name string) string {
	name = SanitizeString(name)

	// Remove leading/trailing spaces and collapse multiple spaces
	name = strings.TrimSpace(name)
	name = regexp.MustCompile(`\s+`).ReplaceAllString(name, " ")

	return name
}

// ValidateTenantID validates tenant ID format
func ValidateTenantID(tenantID string) error {
	tenantID = strings.TrimSpace(tenantID)
	if tenantID == "" {
		return fmt.Errorf("tenant_id is required")
	}
	// Aligned with middleware validation (3-128 characters)
	if len(tenantID) < 3 || len(tenantID) > 128 {
		return fmt.Errorf("tenant_id must be between 3 and 128 characters")
	}

	// Tenant ID should be alphanumeric with hyphens and underscores
	if !regexp.MustCompile(`^[a-zA-Z0-9_-]+$`).MatchString(tenantID) {
		return fmt.Errorf("tenant_id contains invalid characters")
	}

	return nil
}

// ValidateObjectID validates MongoDB ObjectID format
func ValidateObjectID(id string) error {
	if id == "" {
		return fmt.Errorf("id is required")
	}

	// MongoDB ObjectID is 24 character hex string
	if !regexp.MustCompile(`^[0-9a-fA-F]{24}$`).MatchString(id) {
		return fmt.Errorf("invalid id format")
	}

	return nil
}

// ValidatePagination validates pagination parameters
func ValidatePagination(page, pageSize int) (int, int, error) {
	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}

	return page, pageSize, nil
}

// ValidateSearchQuery validates search query
func ValidateSearchQuery(query string) error {
	query = strings.TrimSpace(query)
	if query == "" {
		return fmt.Errorf("search query is required")
	}

	if len(query) < 2 {
		return fmt.Errorf("search query must be at least 2 characters")
	}

	if len(query) > 100 {
		return fmt.Errorf("search query is too long (max 100 characters)")
	}

	return nil
}
