/**
 * Startup Check Component
 * Kiểm tra và hiển thị trạng thái cấu hình khi app khởi động
 */

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { isMockMode } from '@/services/api/apiClient';

interface ConfigCheck {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  fix?: string;
}

export function StartupCheck() {
  const [checks, setChecks] = useState<ConfigCheck[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    performChecks();
  }, []);

  const performChecks = () => {
    const results: ConfigCheck[] = [];

    // Check 1: Environment variable
    const env = import.meta.env.VITE_ENVIRONMENT;
    if (env) {
      results.push({
        name: 'Environment',
        status: 'ok',
        message: `Environment: ${env}`,
      });
    } else {
      results.push({
        name: 'Environment',
        status: 'warning',
        message: 'VITE_ENVIRONMENT not set, using default "local"',
        fix: 'Add VITE_ENVIRONMENT=local to .env file',
      });
    }

    // Check 2: Mock mode configuration
    const mockEnv = import.meta.env.VITE_USE_MOCK_API;
    const isUsingMock = isMockMode();
    
    if (mockEnv === 'true') {
      results.push({
        name: 'Mock API',
        status: 'ok',
        message: 'Mock mode enabled (using local data)',
      });
    } else if (mockEnv === 'false') {
      results.push({
        name: 'Mock API',
        status: 'ok',
        message: 'Real API mode (connecting to backend)',
      });
    } else {
      results.push({
        name: 'Mock API',
        status: 'warning',
        message: 'VITE_USE_MOCK_API not configured, defaulting to mock mode',
        fix: 'Add VITE_USE_MOCK_API=true to .env file and restart server',
      });
    }

    // Check 3: API URL
    const apiUrl = import.meta.env.VITE_API_URL_LOCAL;
    if (apiUrl) {
      results.push({
        name: 'API URL',
        status: 'ok',
        message: `Local API: ${apiUrl}`,
      });
    } else {
      results.push({
        name: 'API URL',
        status: 'warning',
        message: 'Using default API URL',
        fix: 'Add VITE_API_URL_LOCAL to .env file',
      });
    }

    setChecks(results);

    // Auto show details if there are warnings/errors
    const hasIssues = results.some(c => c.status !== 'ok');
    if (hasIssues) {
      setShowDetails(true);
    }
  };

  const hasWarnings = checks.some(c => c.status === 'warning' || c.status === 'error');

  // Don't show if everything is OK and details are hidden
  if (!hasWarnings && !showDetails) {
    return null;
  }

  return (
    <div className="fixed bottom-32 right-4 z-40 max-w-md animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div
          className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
            hasWarnings
              ? 'bg-amber-50/80 dark:bg-amber-950/40'
              : 'bg-green-50/80 dark:bg-green-950/40'
          }`}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-center gap-2">
            {hasWarnings ? (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className="font-medium text-sm">
              {hasWarnings ? 'Configuration Warnings' : 'System Ready'}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showDetails ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {checks.map((check, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {check.status === 'ok' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {check.status === 'warning' && (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                  {check.status === 'error' && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {check.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {check.message}
                  </div>
                  {check.fix && (
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded px-2 py-1">
                      💡 {check.fix}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {hasWarnings && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-sm">
                  <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    ⚠️ Restart Required
                  </div>
                  <div className="text-blue-700 dark:text-blue-300 text-xs">
                    Next.js không hot-reload environment variables. Bạn PHẢI restart dev server!
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2">
                  <div className="text-xs font-medium text-foreground">
                    Cách restart:
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded font-mono">
                      Ctrl+C → npm run dev
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('npm run dev');
                        alert('Đã copy "npm run dev" vào clipboard!');
                      }}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs transition-colors"
                      title="Copy command"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page (sau khi restart server)
                </button>
                
                <p className="text-xs text-center text-muted-foreground">
                  1. Stop server (Ctrl+C) → 2. Run "npm run dev" → 3. Click Reload
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}