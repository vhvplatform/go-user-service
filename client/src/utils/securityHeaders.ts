/**
 * Security Headers Configuration
 * Implements OWASP recommended security headers
 */

/**
 * Content Security Policy (CSP)
 * Prevents XSS, clickjacking, and other code injection attacks
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // TODO: Remove after moving inline scripts
    // Add trusted CDNs if needed
    // 'https://cdn.jsdelivr.net',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Tailwind requires this
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:', // Allow HTTPS images
    'blob:', // For generated images
  ],
  'connect-src': [
    "'self'",
    // Add your API domains
    import.meta.env.VITE_GO_USER_SERVICE_URL || '',
    import.meta.env.VITE_API_BASE_URL || '',
  ].filter(Boolean),
  'frame-ancestors': ["'none'"], // Prevent clickjacking
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * Generate CSP header string
 */
export function generateCspHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => {
      if (values.length === 0) {
        return directive;
      }
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Security Headers Configuration
 */
export const SECURITY_HEADERS = {
  /**
   * Content Security Policy
   * Prevents XSS and data injection attacks
   */
  'Content-Security-Policy': generateCspHeader(),

  /**
   * Strict Transport Security (HSTS)
   * Forces HTTPS connections
   */
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  /**
   * X-Frame-Options
   * Prevents clickjacking attacks
   */
  'X-Frame-Options': 'DENY',

  /**
   * X-Content-Type-Options
   * Prevents MIME type sniffing
   */
  'X-Content-Type-Options': 'nosniff',

  /**
   * X-XSS-Protection
   * Enables XSS filter in older browsers
   */
  'X-XSS-Protection': '1; mode=block',

  /**
   * Referrer-Policy
   * Controls referrer information
   */
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  /**
   * Permissions-Policy
   * Controls browser features
   */
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '),

  /**
   * X-Permitted-Cross-Domain-Policies
   * Controls cross-domain policy files
   */
  'X-Permitted-Cross-Domain-Policies': 'none',

  /**
   * X-Download-Options
   * Prevents MIME-based attacks in IE
   */
  'X-Download-Options': 'noopen',

  /**
   * Cross-Origin-Embedder-Policy
   * Prevents cross-origin attacks
   */
  'Cross-Origin-Embedder-Policy': 'require-corp',

  /**
   * Cross-Origin-Opener-Policy
   * Isolates browsing context
   */
  'Cross-Origin-Opener-Policy': 'same-origin',

  /**
   * Cross-Origin-Resource-Policy
   * Protects resources from cross-origin requests
   */
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/**
 * Apply security headers to all requests
 * Call this in your main.tsx or index.html
 */
export function applySecurityHeaders(): void {
  // Check if running in iframe (clickjacking detection)
  if (window.self !== window.top) {
    console.error('⚠️ Security Warning: Application running in iframe');
    // Optionally break out of iframe
    // window.top.location = window.self.location;
  }

  // Log security configuration in development
  if (import.meta.env.DEV) {
    console.group('🔒 Security Headers Configuration');
    console.log('CSP:', SECURITY_HEADERS['Content-Security-Policy']);
    console.log('HSTS:', SECURITY_HEADERS['Strict-Transport-Security']);
    console.log('Frame Options:', SECURITY_HEADERS['X-Frame-Options']);
    console.groupEnd();
  }
}

/**
 * Validate security headers (for testing)
 */
export function validateSecurityHeaders(headers: Record<string, string>): {
  valid: boolean;
  missing: string[];
  warnings: string[];
} {
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
  ];

  const recommendedHeaders = [
    'Strict-Transport-Security',
    'X-XSS-Protection',
    'Permissions-Policy',
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required headers
  for (const header of requiredHeaders) {
    if (!headers[header] && !headers[header.toLowerCase()]) {
      missing.push(header);
    }
  }

  // Check recommended headers
  for (const header of recommendedHeaders) {
    if (!headers[header] && !headers[header.toLowerCase()]) {
      warnings.push(`Missing recommended header: ${header}`);
    }
  }

  // Additional checks
  if (headers['X-Frame-Options'] === 'ALLOW') {
    warnings.push('X-Frame-Options should not be ALLOW (clickjacking risk)');
  }

  const csp = headers['Content-Security-Policy'] || headers['content-security-policy'];
  if (csp && csp.includes("'unsafe-eval'")) {
    warnings.push("CSP contains 'unsafe-eval' (security risk)");
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Security Headers for Nginx Configuration
 * Copy this to your nginx.conf
 */
export const NGINX_SECURITY_HEADERS = `
# Security Headers
add_header Content-Security-Policy "${generateCspHeader()}" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header X-Permitted-Cross-Domain-Policies "none" always;
add_header X-Download-Options "noopen" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
`;

/**
 * Security Headers for Vite dev server
 * Add to vite.config.ts
 */
export const VITE_SECURITY_HEADERS = {
  server: {
    headers: SECURITY_HEADERS,
  },
};

/**
 * Meta tags for security (add to index.html)
 */
export const SECURITY_META_TAGS = `
<!-- Security Meta Tags -->
<meta http-equiv="Content-Security-Policy" content="${generateCspHeader()}">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">
`;

export default {
  SECURITY_HEADERS,
  CSP_DIRECTIVES,
  generateCspHeader,
  applySecurityHeaders,
  validateSecurityHeaders,
  NGINX_SECURITY_HEADERS,
  VITE_SECURITY_HEADERS,
  SECURITY_META_TAGS,
};