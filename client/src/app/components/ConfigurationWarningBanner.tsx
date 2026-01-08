/**
 * Configuration Warning Banner
 * Hiển thị banner cảnh báo khi có vấn đề về configuration
 * Compact version - chi tiết xem ở EnvironmentPanel
 * Updated for Next.js
 */

import { useEffect, useState } from 'react';
import { AlertTriangle, X, Settings } from 'lucide-react';

export function ConfigurationWarningBanner() {
  const [hasWarning, setHasWarning] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if VITE_USE_MOCK_API is configured
    const mockEnv = import.meta.env.VITE_USE_MOCK_API;
    
    if (mockEnv === undefined || mockEnv === '') {
      setHasWarning(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (!hasWarning || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-amber-50/98 to-orange-50/98 dark:from-amber-950/90 dark:to-orange-950/90 backdrop-blur-xl border-b border-amber-200/50 dark:border-amber-800/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-200 mb-0.5">
                Configuration Missing
              </h3>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90">
                Environment variable <code className="px-1.5 py-0.5 bg-amber-200/60 dark:bg-amber-800/60 rounded font-mono text-amber-900 dark:text-amber-200">VITE_USE_MOCK_API</code> chưa được cấu hình. Xem chi tiết ở Environment Panel (góc dưới phải).
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Scroll to bottom right to show environment panel
                  const envPanel = document.querySelector('[data-environment-panel]');
                  if (envPanel) {
                    envPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg"
                title="Xem Environment Panel"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Chi tiết</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-amber-200/50 dark:hover:bg-amber-800/50 rounded-lg transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}