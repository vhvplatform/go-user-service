import { LayoutDashboard, LogIn, Settings, ChevronLeft, ChevronRight, Users, FileText, BarChart3, Package, Bell, Activity, Server, Code } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentView: 'dashboard' | 'users' | 'login' | 'settings' | 'profile' | 'analytics' | 'notifications' | 'reports' | 'activity-logs' | 'teams' | 'system-health' | 'api-demo';
  onViewChange: (view: 'dashboard' | 'users' | 'login' | 'settings' | 'profile' | 'analytics' | 'notifications' | 'reports' | 'activity-logs' | 'teams' | 'system-health' | 'api-demo') => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'users' as const,
      label: 'Quản lý người dùng',
      icon: Users,
      badge: null,
    },
    {
      id: 'analytics' as const,
      label: 'Phân tích',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'reports' as const,
      label: 'Báo cáo',
      icon: FileText,
      badge: null,
    },
    {
      id: 'activity-logs' as const,
      label: 'Lịch sử hoạt động',
      icon: Activity,
      badge: null,
    },
    {
      id: 'notifications' as const,
      label: 'Thông báo',
      icon: Bell,
      badge: '3',
    },
    {
      id: 'teams' as const,
      label: 'Quản lý nhóm',
      icon: Users,
      badge: null,
    },
    {
      id: 'system-health' as const,
      label: 'Giám sát hệ thống',
      icon: Server,
      badge: null,
    },
    {
      id: 'api-demo' as const,
      label: 'Demo API',
      icon: Code,
      badge: null,
    },
  ];

  const bottomItems = [
    {
      id: 'settings' as const,
      label: 'Cài đặt',
      icon: Settings,
    },
  ];

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-card/80 dark:bg-card/60 backdrop-blur-xl border-r border-border/40 transition-all duration-300 z-40 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isClickable = item.id === 'dashboard' || item.id === 'users' || item.id === 'analytics' || 
                               item.id === 'reports' || item.id === 'notifications' || item.id === 'activity-logs' ||
                               item.id === 'teams' || item.id === 'system-health' || item.id === 'api-demo';

            return (
              <button
                key={item.id}
                onClick={() => isClickable && onViewChange(item.id)}
                disabled={!isClickable}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/50'
                    : isClickable
                    ? 'hover:bg-muted/50 dark:hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground/50 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-white' : ''
                }`} />
                
                {!collapsed && (
                  <>
                    <span className={`text-sm font-medium flex-1 text-left ${
                      isActive ? 'text-white' : ''
                    }`}>
                      {item.label}
                    </span>
                    
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-4 space-y-2 border-t border-border/40 pt-4">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/50'
                    : 'hover:bg-muted/50 dark:hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium flex-1 text-left">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          {/* Bundle Button */}
          {!collapsed && (
            <div className="mt-4 px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Bundle</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                Version 2.0.0<br />
                VHV Platform
              </p>
              <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                Nâng cấp
              </button>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 dark:hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all duration-200 mt-2"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium flex-1 text-left">Thu gọn</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}