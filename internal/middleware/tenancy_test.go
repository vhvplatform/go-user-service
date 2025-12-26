package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestTenancyMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		tenantID       string
		expectedStatus int
		expectedError  bool
	}{
		{
			name:           "valid tenant ID",
			tenantID:       "tenant-123",
			expectedStatus: http.StatusOK,
			expectedError:  false,
		},
		{
			name:           "missing tenant ID",
			tenantID:       "",
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name:           "tenant ID too short",
			tenantID:       "ab",
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name:           "tenant ID too long",
			tenantID:       strings.Repeat("a", 129),
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name:           "valid minimum length",
			tenantID:       "abc",
			expectedStatus: http.StatusOK,
			expectedError:  false,
		},
		{
			name:           "valid maximum length",
			tenantID:       strings.Repeat("a", 128),
			expectedStatus: http.StatusOK,
			expectedError:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := gin.New()
			router.Use(TenancyMiddleware())
			router.GET("/test", func(c *gin.Context) {
				tenantID := GetTenantID(c)
				c.JSON(http.StatusOK, gin.H{"tenant_id": tenantID})
			})

			req := httptest.NewRequest("GET", "/test", nil)
			if tt.tenantID != "" {
				req.Header.Set(TenantIDHeader, tt.tenantID)
			}
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestGetTenantID(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(TenancyMiddleware())
	router.GET("/test", func(c *gin.Context) {
		tenantID := GetTenantID(c)
		c.JSON(http.StatusOK, gin.H{"tenant_id": tenantID})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set(TenantIDHeader, "test-tenant")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "test-tenant")
}

func TestMustGetTenantID(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("with tenant ID present", func(t *testing.T) {
		router := gin.New()
		router.Use(TenancyMiddleware())
		router.GET("/test", func(c *gin.Context) {
			tenantID := MustGetTenantID(c)
			c.JSON(http.StatusOK, gin.H{"tenant_id": tenantID})
		})

		req := httptest.NewRequest("GET", "/test", nil)
		req.Header.Set(TenantIDHeader, "must-tenant")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "must-tenant")
	})

	t.Run("without tenant ID should panic", func(t *testing.T) {
		router := gin.New()
		router.GET("/test", func(c *gin.Context) {
			defer func() {
				if r := recover(); r != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "panic"})
				}
			}()
			MustGetTenantID(c)
			c.JSON(http.StatusOK, gin.H{"tenant_id": "ok"})
		})

		req := httptest.NewRequest("GET", "/test", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})
}
