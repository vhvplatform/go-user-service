/**
 * Environment Indicator Component
 * Hiển thị môi trường hiện tại và mock mode status
 */

import { useEffect, useState } from 'react';
import { Server, Database, AlertCircle } from 'lucide-react';

type Environment = 'local' | 'dev' | 'staging' | 'production';

interface EnvironmentConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Server;
}

const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  local: {
    label: 'Local',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    icon: Server,
  },
  dev: {
    label: 'Development',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-300 dark:border-blue-700',
    icon: Server,
  },
  staging: {
    label: 'Staging',
    color: 'text-yellow-700 dark:text-yellow-300',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
    icon: AlertCircle,
  },
  production: {
    label: 'Production',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-300 dark:border-green-700',
    icon: Server,
  },
};

export function EnvironmentIndicator() {
  const [environment, setEnvironment] = useState<Environment>('local');
  const [isMock, setIsMock] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const env = (import.meta.env.VITE_ENVIRONMENT || 'local') as Environment;
    const mockMode = import.meta.env.VITE_USE_MOCK_API === 'true';
    
    setEnvironment(env);
    setIsMock(mockMode);
  }, []);

  // Không hiển thị ở production
  if (environment === 'production') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-white dark:bg-gray-800 border-2 border-border rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        title="Show environment info"
      >
        <Server className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  const config = environmentConfigs[environment];
  const Icon = config.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden`}>
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between gap-3 border-b border-current/10">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className={`text-sm font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={`p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors ${config.color}`}
            title="Hide"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-2">
          {/* API Mode */}
          <div className="flex items-center justify-between gap-4">
            <span className={`text-xs font-medium ${config.color}`}>
              API Mode:
            </span>
            <div className="flex items-center gap-1.5">
              <Database className={`w-3.5 h-3.5 ${isMock ? 'text-orange-500' : 'text-green-500'}`} />
              <span className={`text-xs font-semibold ${isMock ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {isMock ? 'Mock' : 'Live'}
              </span>
            </div>
          </div>

          {/* Environment URL */}
          <div className="pt-2 border-t border-current/10">
            <span className={`text-[10px] font-mono ${config.color} opacity-70 break-all`}>
              {import.meta.env[`VITE_API_URL_${environment.toUpperCase()}`] || 'N/A'}
            </span>
          </div>
        </div>

        {/* Warning for non-production environments */}
        {isMock && (
          <div className="px-4 py-2 bg-orange-100 dark:bg-orange-950/50 border-t border-orange-300 dark:border-orange-800">
            <div className="flex items-start gap-1.5 mt-2 bg-orange-50/50 dark:bg-orange-950/30 rounded-lg px-2 py-1.5 border border-orange-200/30 dark:border-orange-800/30">
              <AlertCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <span className="text-[10px] text-orange-700 dark:text-orange-300 leading-tight">
                Using mock data. Set VITE_USE_MOCK_API=false for real API.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}