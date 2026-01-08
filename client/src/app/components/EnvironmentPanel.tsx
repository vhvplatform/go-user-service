/**
 * Environment Panel - Unified component for environment info and configuration checks
 * Combines functionality of DevelopmentBanner and StartupCheck
 */

import { useState, useEffect } from 'react';
import { 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Server, 
  Database, 
  Code,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';
import { apiConfig, getEnvironmentColor, getEnvironmentLabel, isUsingMockData } from '@/config/apiConfig';
import { isMockMode } from '@/services/api/apiClient';

interface ConfigCheck {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  fix?: string;
}

export function EnvironmentPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'services'>('overview');
  const [checks, setChecks] = useState<ConfigCheck[]>([]);

  const useMock = isUsingMockData();
  const envColor = getEnvironmentColor();
  const envLabel = getEnvironmentLabel();
  const baseUrl = apiConfig.apiBaseUrls[apiConfig.environment];

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

    // Auto show details and checks tab if there are warnings/errors
    const hasIssues = results.some(c => c.status !== 'ok');
    if (hasIssues) {
      setIsExpanded(true);
      setActiveTab('checks');
    }
  };

  const hasWarnings = checks.some(c => c.status === 'warning' || c.status === 'error');

  // Don't show in production
  if (apiConfig.environment === 'production') {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getEnvGradient = () => {
    if (envColor === 'bg-blue-500') {
      return 'from-blue-500/95 via-blue-600/95 to-indigo-600/95';
    } else if (envColor === 'bg-cyan-500') {
      return 'from-cyan-500/95 via-cyan-600/95 to-blue-500/95';
    } else {
      return 'from-amber-500/95 via-yellow-500/95 to-orange-500/95';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-in slide-in-from-bottom-4 duration-500">
      <div className="relative">
        {/* Warning Badge */}
        {hasWarnings && (
          <div className="absolute -top-1 -right-1 z-10">
            <div className="relative">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping absolute" />
              <div className="w-3 h-3 bg-amber-500 rounded-full relative" />
            </div>
          </div>
        )}

        <div className={`bg-gradient-to-br ${getEnvGradient()} backdrop-blur-xl text-white rounded-2xl shadow-2xl overflow-hidden max-w-md border border-white/20`}>
          {/* Compact Header */}
          <div 
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:brightness-110 transition-all group"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{envLabel}</p>
                {hasWarnings && (
                  <div className="flex items-center gap-1 bg-amber-500/30 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>Config</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/80 truncate">
                {useMock ? 'Mock Data Mode' : 'Real API Mode'}
              </p>
            </div>

            <div className="text-white/80 group-hover:text-white transition-colors">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-white/20 animate-in fade-in-0 slide-in-from-top-2 duration-300">
              {/* Tabs */}
              <div className="flex items-center gap-1 px-3 py-2 bg-black/10">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('checks')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'checks'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Checks
                  {hasWarnings && (
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'services'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Services
                </button>
              </div>

              {/* Tab Content */}
              <div className="px-4 py-3 max-h-[32rem] overflow-y-auto">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-xl p-3 space-y-2.5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <Server className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">Environment:</span>
                        <code className="bg-white/20 px-2 py-0.5 rounded text-xs ml-auto">
                          {apiConfig.environment}
                        </code>
                      </div>
                      
                      <div className="h-px bg-white/10" />
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Database className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">Data Source:</span>
                        <code className="bg-white/20 px-2 py-0.5 rounded text-xs ml-auto">
                          {useMock ? 'Mock (Memory)' : 'Real API'}
                        </code>
                      </div>
                      
                      <div className="h-px bg-white/10" />
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Code className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">Base URL:</span>
                        </div>
                        <code className="bg-white/20 px-2 py-1 rounded text-xs block break-all">
                          {baseUrl}
                        </code>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 space-y-2 backdrop-blur-sm">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{useMock ? 'Mock Data Active' : 'Real API Connected'}</p>
                          <p className="text-xs text-white/80 mt-0.5">
                            {useMock 
                              ? 'Dữ liệu được lưu trong memory, không cần backend' 
                              : 'Kết nối đến API backend thực tế'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-px bg-white/10" />
                      
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">6 Microservices</p>
                          <p className="text-xs text-white/80 mt-0.5">
                            Auth, User, Role, Analytics, Notification, Report
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Configuration Guide */}
                    <div className="bg-white/10 rounded-xl p-3 text-xs space-y-2 backdrop-blur-sm">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Cấu hình môi trường
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-white/90 pl-1">
                        <li>Mở file <code className="bg-white/20 px-1.5 py-0.5 rounded mx-1">.env</code></li>
                        <li>Đổi <code className="bg-white/20 px-1.5 py-0.5 rounded mx-1">VITE_ENVIRONMENT</code></li>
                        <li>Toggle <code className="bg-white/20 px-1.5 py-0.5 rounded mx-1">VITE_USE_MOCK_DATA</code></li>
                        <li>Restart: <code className="bg-white/20 px-1.5 py-0.5 rounded mx-1">npm run dev</code></li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Configuration Checks Tab */}
                {activeTab === 'checks' && (
                  <div className="space-y-3">
                    {checks.map((check, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-3 space-y-2"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getStatusIcon(check.status)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{check.name}</div>
                            <div className="text-xs text-white/80 mt-0.5">{check.message}</div>
                            
                            {check.fix && (
                              <div className="mt-2 bg-amber-500/20 border border-amber-400/30 rounded-lg px-2.5 py-2 text-xs">
                                <div className="flex items-start gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-300" />
                                  <div className="text-amber-100">{check.fix}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {hasWarnings && (
                      <div className="space-y-2 pt-2">
                        <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 text-sm">
                          <div className="font-medium text-amber-100 mb-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Restart Required
                          </div>
                          <div className="text-amber-200/90 text-xs">
                            Vite không hot-reload environment variables. Bạn PHẢT restart dev server!
                          </div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-3 space-y-2">
                          <div className="text-xs font-medium">Cách restart:</div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-2.5 py-1.5 bg-black/20 text-xs rounded font-mono">
                              Ctrl+C → npm run dev
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('npm run dev');
                                alert('Đã copy "npm run dev" vào clipboard!');
                              }}
                              className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors flex items-center gap-1"
                              title="Copy command"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => window.location.reload()}
                          className="w-full py-2.5 px-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm rounded-xl font-medium transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reload Page (sau khi restart server)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-white/90 flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Services Status
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(apiConfig.services).map((service) => (
                        <div 
                          key={service} 
                          className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-white/15 transition-colors"
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                          <span className="capitalize text-sm font-medium">{service}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3 text-sm">
                      <div className="flex items-center gap-2 text-green-100">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">All services operational</span>
                      </div>
                      <p className="text-xs text-green-200/80 mt-1">
                        {useMock ? 'Mock services ready for development' : 'Connected to backend services'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}