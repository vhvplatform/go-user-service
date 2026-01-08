import { Search, Bell, Globe, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Người dùng mới', message: 'Nguyễn Văn An vừa đăng ký', time: '2 phút trước', unread: true },
    { id: 2, title: 'Cập nhật hệ thống', message: 'Phiên bản 2.0 đã sẵn sàng', time: '1 giờ trước', unread: true },
    { id: 3, title: 'Báo cáo tuần', message: 'Báo cáo tuần đã được tạo', time: '3 giờ trước', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 dark:bg-card/60 backdrop-blur-xl border-b border-border/40 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-4 min-w-[260px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/40 transition-shadow duration-300">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">VHV Platform</span>
              <span className="text-xs text-muted-foreground">Microservices Framework</span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className={`relative group transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
              searchFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <input
              type="text"
              placeholder="Tìm kiếm hoặc nhảy đến..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-12 pr-20 py-2.5 bg-muted/30 dark:bg-muted/20 border border-border/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background dark:focus:bg-card transition-all duration-200 placeholder:text-muted-foreground"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-muted/50 dark:bg-muted/30 rounded-md">
              <kbd className="text-xs text-muted-foreground font-medium">⌘</kbd>
              <kbd className="text-xs text-muted-foreground font-medium">K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-lg transition-all duration-200 group"
            >
              <Globe className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm text-foreground">Tiếng Việt</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown */}
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card/95 dark:bg-card/90 backdrop-blur-xl rounded-xl border border-border/40 shadow-xl py-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors flex items-center justify-between group">
                  <span className="text-foreground">Tiếng Việt</span>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors text-muted-foreground">
                  English
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              onNavigate?.('notifications');
            }}
            className="relative p-2.5 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-xl transition-all duration-200 group"
          >
            <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-card dark:border-background animate-pulse"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Action Button */}
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/50 transition-all duration-200 text-sm font-medium hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
            <span>Hành động</span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-lg transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">Admin</span>
                <span className="text-xs text-muted-foreground">Quản trị viên</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-card/95 dark:bg-card/90 backdrop-blur-xl rounded-xl border border-border/40 shadow-2xl py-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border/40">
                  <p className="font-semibold text-foreground">Admin User</p>
                  <p className="text-sm text-muted-foreground">admin@vhvplatform.com</p>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate?.('profile');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors flex items-center gap-3 group"
                  >
                    <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-foreground">Hồ sơ cá nhân</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate?.('settings');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors flex items-center gap-3 group"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-foreground">Cài đặt</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-destructive/10 transition-colors flex items-center gap-3 group text-destructive">
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}