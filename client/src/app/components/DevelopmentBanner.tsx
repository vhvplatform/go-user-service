import { AlertCircle, CheckCircle2, Settings, Database, Server, Code } from 'lucide-react';
import { useState } from 'react';
import { apiConfig, getEnvironmentColor, getEnvironmentLabel, isUsingMockData } from '@/config/apiConfig';

export function DevelopmentBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDevelopment = apiConfig.environment === 'dev' || apiConfig.environment === 'dev-shared';
  const useMock = isUsingMockData();
  const envColor = getEnvironmentColor();
  const envLabel = getEnvironmentLabel();
  const baseUrl = apiConfig.apiBaseUrls[apiConfig.environment];

  if (apiConfig.environment === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-in slide-in-from-bottom-4 duration-500">
      <div className={`${envColor === 'bg-blue-500' ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/90' : envColor === 'bg-cyan-500' ? 'bg-gradient-to-r from-cyan-500/90 to-cyan-600/90' : 'bg-gradient-to-r from-yellow-500/90 to-yellow-600/90'} backdrop-blur-xl text-white rounded-xl shadow-2xl overflow-hidden max-w-md border border-white/20`}>
        {/* Compact View */}
        <div 
          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:brightness-110 transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{envLabel}</p>
            <p className="text-xs text-white/80">{useMock ? 'Mock Data Mode' : 'Real API Mode'}</p>
          </div>
          <AlertCircle className="w-5 h-5" />
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-white/20 pt-3 space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
            {/* Environment Info */}
            <div className="bg-white/10 rounded-lg p-3 space-y-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm">
                <Server className="w-4 h-4" />
                <span className="font-medium">Environment:</span>
                <code className="bg-white/20 px-2 py-0.5 rounded text-xs">{apiConfig.environment}</code>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Database className="w-4 h-4" />
                <span className="font-medium">Data Source:</span>
                <code className="bg-white/20 px-2 py-0.5 rounded text-xs">{useMock ? 'Mock (In-Memory)' : 'Real API'}</code>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Code className="w-4 h-4" />
                <span className="font-medium">Base URL:</span>
              </div>
              <code className="bg-white/20 px-2 py-1 rounded text-xs block break-all">{baseUrl}</code>
            </div>

            {/* Features */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{useMock ? 'Mock Data Active' : 'Real API Connected'}</p>
                  <p className="text-xs text-white/80">
                    {useMock ? 'Dữ liệu được lưu trong memory, không cần backend' : 'Kết nối đến API backend thực tế'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">6 Microservices</p>
                  <p className="text-xs text-white/80">Auth, User, Role, Analytics, Notification, Report</p>
                </div>
              </div>
            </div>

            {/* Configuration Guide */}
            <div className="bg-white/10 rounded-lg p-3 text-xs space-y-2 backdrop-blur-sm">
              <p className="font-medium text-white/90">Cấu hình môi trường:</p>
              <ol className="list-decimal list-inside space-y-1 text-white/80">
                <li>Mở file <code className="bg-white/20 px-1 rounded">.env</code></li>
                <li>Đổi <code className="bg-white/20 px-1 rounded">VITE_ENVIRONMENT</code> (dev/dev-shared/staging/production)</li>
                <li>Toggle <code className="bg-white/20 px-1 rounded">VITE_USE_MOCK_DATA</code> (true/false)</li>
                <li>Restart dev server: <code className="bg-white/20 px-1 rounded">npm run dev</code></li>
              </ol>
            </div>

            {/* Service Status */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-white/90">Services Status:</p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {Object.keys(apiConfig.services).map((service) => (
                  <div key={service} className="flex items-center gap-1.5 bg-white/10 rounded px-2 py-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}