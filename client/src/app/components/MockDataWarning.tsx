/**
 * Mock Data Warning Component
 * Hiển thị warning khi hệ thống không có mock data hoặc backend không khả dụng
 */

import { AlertTriangle, Settings, Server } from 'lucide-react';

interface MockDataWarningProps {
  show: boolean;
  onEnableMock?: () => void;
}

export function MockDataWarning({ show, onEnableMock }: MockDataWarningProps) {
  if (!show) return null;

  return (
    <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
            Không thể kết nối đến backend
          </h3>
          
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
            Hệ thống không thể kết nối đến API backend. Vui lòng kiểm tra một trong các vấn đề sau:
          </p>

          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
              <Server className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Backend service chưa chạy hoặc không khả dụng</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
              <Settings className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>File <code className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/70 rounded font-mono text-xs">.env</code> chưa được cấu hình đúng</span>
            </li>
          </ul>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">
              🔧 Giải pháp:
            </p>
            
            <div className="space-y-3 text-sm text-orange-700 dark:text-orange-300">
              <div>
                <p className="font-medium mb-1">1. Bật Mock Data Mode (khuyến nghị cho development):</p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-xs">
                  <div>Tạo file <code>.env</code> với nội dung:</div>
                  <div className="mt-1 text-orange-600 dark:text-orange-400">
                    VITE_USE_MOCK_API=true
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">2. Hoặc chạy backend service:</p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-xs">
                  <div># Khởi động backend trên localhost:8080</div>
                  <div className="text-blue-600 dark:text-blue-400">go run main.go</div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">3. Sau đó restart development server:</p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-xs">
                  <div className="text-green-600 dark:text-green-400">npm run dev</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <a
              href="/ENVIRONMENT_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              📚 Xem hướng dẫn chi tiết
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}