/**
 * Network Error Fallback Component
 * Hiển thị khi có Network Error và hướng dẫn fix
 */

import { useState } from 'react';
import { AlertCircle, RefreshCw, Settings, ExternalLink, CheckCircle } from 'lucide-react';

interface NetworkErrorFallbackProps {
  onRetry?: () => void;
}

export function NetworkErrorFallback({ onRetry }: NetworkErrorFallbackProps) {
  const [copied, setCopied] = useState(false);

  const envConfig = `# Environment Configuration
VITE_ENVIRONMENT=local
VITE_API_URL_LOCAL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=true
VITE_ENABLE_DEBUG=true`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Network Error</h2>
                <p className="text-white/90 text-sm mt-1">
                  Không thể kết nối đến backend API
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Problem */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Vấn đề
              </h3>
              <p className="text-muted-foreground text-sm">
                Hệ thống không thể kết nối đến API backend. Có thể do:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-6">
                <li className="list-disc">Backend service chưa chạy</li>
                <li className="list-disc">File <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">.env</code> chưa được cấu hình</li>
                <li className="list-disc">Mock mode chưa được bật</li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Giải pháp nhanh
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    1. Tạo file <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">.env</code> trong thư mục root:
                  </p>
                  
                  <div className="relative">
                    <div className="bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
                      <pre>{envConfig}</pre>
                    </div>
                    
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đã copy!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    2. Restart development server:
                  </p>
                  <div className="bg-gray-900 dark:bg-black rounded-lg p-3 font-mono text-xs text-green-400">
                    <div className="text-gray-400"># Ctrl+C để stop, sau đó:</div>
                    <div>npm run dev</div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    3. Reload trang này:
                  </p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Thử lại
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Docs Link */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <a
                href="/TROUBLESHOOTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
              >
                📚 Xem hướng dẫn chi tiết
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Sau khi tạo file .env và restart server, mọi thứ sẽ hoạt động bình thường</p>
        </div>
      </div>
    </div>
  );
}