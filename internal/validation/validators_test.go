package validation

import (
	"strings"
	"testing"
)

func TestValidateEmail(t *testing.T) {
	tests := []struct {
		name    string
		email   string
		wantErr bool
	}{
		{
			name:    "valid email",
			email:   "user@example.com",
			wantErr: false,
		},
		{
			name:    "valid email with subdomain",
			email:   "user@mail.example.com",
			wantErr: false,
		},
		{
			name:    "valid email with plus",
			email:   "user+tag@example.com",
			wantErr: false,
		},
		{
			name:    "empty email",
			email:   "",
			wantErr: true,
		},
		{
			name:    "invalid format - no @",
			email:   "userexample.com",
			wantErr: true,
		},
		{
			name:    "invalid format - no domain",
			email:   "user@",
			wantErr: true,
		},
		{
			name:    "invalid format - no user",
			email:   "@example.com",
			wantErr: true,
		},
		{
			name:    "too long email",
			email:   strings.Repeat("a", 300) + "@example.com",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateEmail(tt.email)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateEmail() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidateName(t *testing.T) {
	tests := []struct {
		name      string
		nameValue string
		fieldName string
		wantErr   bool
	}{
		{
			name:      "valid simple name",
			nameValue: "John",
			fieldName: "first_name",
			wantErr:   false,
		},
		{
			name:      "valid name with hyphen",
			nameValue: "Mary-Jane",
			fieldName: "first_name",
			wantErr:   false,
		},
		{
			name:      "valid name with apostrophe",
			nameValue: "O'Brien",
			fieldName: "last_name",
			wantErr:   false,
		},
		{
			name:      "valid unicode name",
			nameValue: "José",
			fieldName: "first_name",
			wantErr:   false,
		},
		{
			name:      "empty name",
			nameValue: "",
			fieldName: "first_name",
			wantErr:   true,
		},
		{
			name:      "name with numbers",
			nameValue: "John123",
			fieldName: "first_name",
			wantErr:   true,
		},
		{
			name:      "name with special chars",
			nameValue: "John@Doe",
			fieldName: "first_name",
			wantErr:   true,
		},
		{
			name:      "name too long",
			nameValue: strings.Repeat("a", 150),
			fieldName: "first_name",
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateName(tt.nameValue, tt.fieldName)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateName() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidatePhone(t *testing.T) {
	tests := []struct {
		name    string
		phone   string
		wantErr bool
	}{
		{
			name:    "valid phone with plus",
			phone:   "+1234567890",
			wantErr: false,
		},
		{
			name:    "valid phone without plus",
			phone:   "1234567890",
			wantErr: false,
		},
		{
			name:    "empty phone (optional)",
			phone:   "",
			wantErr: false,
		},
		{
			name:    "invalid phone - starts with zero",
			phone:   "+0123456789",
			wantErr: true,
		},
		{
			name:    "invalid phone - has letters",
			phone:   "+123abc7890",
			wantErr: true,
		},
		{
			name:    "invalid phone - too short",
			phone:   "+12",
			wantErr: true,
		},
		{
			name:    "invalid phone - too long",
			phone:   "+12345678901234567890",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidatePhone(tt.phone)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidatePhone() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidateTenantID(t *testing.T) {
	tests := []struct {
		name     string
		tenantID string
		wantErr  bool
	}{
		{
			name:     "valid tenant ID",
			tenantID: "tenant-123",
			wantErr:  false,
		},
		{
			name:     "valid with underscore",
			tenantID: "tenant_123",
			wantErr:  false,
		},
		{
			name:     "empty tenant ID",
			tenantID: "",
			wantErr:  true,
		},
		{
			name:     "tenant ID with special chars",
			tenantID: "tenant@123",
			wantErr:  true,
		},
		{
			name:     "tenant ID too long",
			tenantID: strings.Repeat("a", 100),
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateTenantID(tt.tenantID)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateTenantID() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidateObjectID(t *testing.T) {
	tests := []struct {
		name    string
		id      string
		wantErr bool
	}{
		{
			name:    "valid ObjectID",
			id:      "507f1f77bcf86cd799439011",
			wantErr: false,
		},
		{
			name:    "valid ObjectID uppercase",
			id:      "507F1F77BCF86CD799439011",
			wantErr: false,
		},
		{
			name:    "empty ID",
			id:      "",
			wantErr: true,
		},
		{
			name:    "too short",
			id:      "507f1f77bcf86cd7",
			wantErr: true,
		},
		{
			name:    "too long",
			id:      "507f1f77bcf86cd799439011aaa",
			wantErr: true,
		},
		{
			name:    "invalid characters",
			id:      "507f1f77bcf86cd79943901g",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateObjectID(tt.id)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateObjectID() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidatePagination(t *testing.T) {
	tests := []struct {
		name             string
		page             int
		pageSize         int
		wantPage         int
		wantPageSize     int
	}{
		{
			name:         "valid pagination",
			page:         2,
			pageSize:     30,
			wantPage:     2,
			wantPageSize: 30,
		},
		{
			name:         "page less than 1",
			page:         0,
			pageSize:     20,
			wantPage:     1,
			wantPageSize: 20,
		},
		{
			name:         "page size less than 1",
			page:         1,
			pageSize:     0,
			wantPage:     1,
			wantPageSize: 20, // default
		},
		{
			name:         "page size greater than 100",
			page:         1,
			pageSize:     150,
			wantPage:     1,
			wantPageSize: 100, // max
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotPage, gotPageSize, err := ValidatePagination(tt.page, tt.pageSize)
			if err != nil {
				t.Errorf("ValidatePagination() error = %v", err)
			}
			if gotPage != tt.wantPage {
				t.Errorf("ValidatePagination() gotPage = %v, want %v", gotPage, tt.wantPage)
			}
			if gotPageSize != tt.wantPageSize {
				t.Errorf("ValidatePagination() gotPageSize = %v, want %v", gotPageSize, tt.wantPageSize)
			}
		})
	}
}

func TestValidateSearchQuery(t *testing.T) {
	tests := []struct {
		name    string
		query   string
		wantErr bool
	}{
		{
			name:    "valid query",
			query:   "john doe",
			wantErr: false,
		},
		{
			name:    "minimum length",
			query:   "ab",
			wantErr: false,
		},
		{
			name:    "empty query",
			query:   "",
			wantErr: true,
		},
		{
			name:    "query too short",
			query:   "a",
			wantErr: true,
		},
		{
			name:    "query too long",
			query:   strings.Repeat("a", 150),
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateSearchQuery(tt.query)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateSearchQuery() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestSanitizeString(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{
			name:  "normal string",
			input: "John Doe",
			want:  "John Doe",
		},
		{
			name:  "string with leading/trailing spaces",
			input: "  John Doe  ",
			want:  "John Doe",
		},
		{
			name:  "string with control characters",
			input: "John\x00Doe\x01",
			want:  "JohnDoe",
		},
		{
			name:  "empty string",
			input: "",
			want:  "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := SanitizeString(tt.input)
			if got != tt.want {
				t.Errorf("SanitizeString() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestSanitizeName(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{
			name:  "normal name",
			input: "John Doe",
			want:  "John Doe",
		},
		{
			name:  "name with extra spaces",
			input: "John  Doe",
			want:  "John Doe",
		},
		{
			name:  "name with leading/trailing spaces",
			input: "  John Doe  ",
			want:  "John Doe",
		},
		{
			name:  "name with multiple spaces",
			input: "John   Middle   Doe",
			want:  "John Middle Doe",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := SanitizeName(tt.input)
			if got != tt.want {
				t.Errorf("SanitizeName() = %v, want %v", got, tt.want)
			}
		})
	}
}
