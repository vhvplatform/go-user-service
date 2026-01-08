import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to error tracking service (e.g., Sentry)
    if (import.meta.env.PROD) {
      // window.Sentry?.captureException(error, { extra: errorInfo });
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Oops! Có lỗi xảy ra</h1>
                    <p className="text-red-100 mt-1">
                      Đã xảy ra lỗi không mong muốn trong ứng dụng
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              <div className="p-8">
                {this.state.error && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                      Chi tiết lỗi:
                    </h2>
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <p className="font-mono text-sm text-red-700 dark:text-red-400 break-all">
                        {this.state.error.toString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Stack Trace (Development only) */}
                {import.meta.env.DEV && this.state.errorInfo && (
                  <details className="mb-6">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Xem stack trace (Development)
                    </summary>
                    <div className="mt-3 bg-gray-100 dark:bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre className="font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Thử lại
                  </button>

                  <button
                    onClick={this.handleReload}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Tải lại trang
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 text-foreground rounded-xl font-medium transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    Về trang chủ
                  </button>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    💡 <strong>Gợi ý:</strong> Nếu lỗi vẫn tiếp tục xảy ra, vui lòng:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-600 dark:text-blue-400 ml-6 list-disc">
                    <li>Xóa cache và cookies của trình duyệt</li>
                    <li>Thử lại với trình duyệt khác</li>
                    <li>Liên hệ với đội ngũ hỗ trợ kỹ thuật</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>VHV Platform v3.3.0 • Nếu cần hỗ trợ, vui lòng liên hệ support@vhvplatform.com</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lightweight error boundary for smaller components
export function SimpleErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Không thể tải nội dung
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Đã xảy ra lỗi khi tải component này
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Tải lại
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;