import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Quick Toggle Button */}
      <button
        onClick={toggleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
        className="group relative p-2.5 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-xl transition-all duration-200"
        title={effectiveTheme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      >
        {/* Icon with smooth rotation */}
        <div className="relative w-5 h-5">
          {/* Sun Icon */}
          <Sun 
            className={`absolute inset-0 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300 ${
              effectiveTheme === 'light' 
                ? 'rotate-0 scale-100 opacity-100' 
                : 'rotate-90 scale-0 opacity-0'
            }`}
          />
          
          {/* Moon Icon */}
          <Moon 
            className={`absolute inset-0 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300 ${
              effectiveTheme === 'dark' 
                ? 'rotate-0 scale-100 opacity-100' 
                : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>

        {/* Glow effect on hover */}
        <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
          effectiveTheme === 'light'
            ? 'bg-yellow-400/0 group-hover:bg-yellow-400/10'
            : 'bg-blue-400/0 group-hover:bg-blue-400/10'
        }`} />
      </button>

      {/* Advanced Menu (Right-click or long press) */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-card/95 dark:bg-card/90 backdrop-blur-xl border border-border/40 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-border/40">
            <p className="text-xs font-medium text-muted-foreground">Chế độ giao diện</p>
          </div>
          
          <div className="py-1">
            {/* Light Theme */}
            <button
              onClick={() => {
                setTheme('light');
                setShowMenu(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-3 group ${
                theme === 'light'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50 dark:hover:bg-muted/30 text-foreground'
              }`}
            >
              <Sun className={`w-4 h-4 transition-colors ${
                theme === 'light' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              <span className="flex-1">Sáng</span>
              {theme === 'light' && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              )}
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => {
                setTheme('dark');
                setShowMenu(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-3 group ${
                theme === 'dark'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50 dark:hover:bg-muted/30 text-foreground'
              }`}
            >
              <Moon className={`w-4 h-4 transition-colors ${
                theme === 'dark' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              <span className="flex-1">Tối</span>
              {theme === 'dark' && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              )}
            </button>

            {/* System Theme */}
            <button
              onClick={() => {
                setTheme('system');
                setShowMenu(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-3 group ${
                theme === 'system'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50 dark:hover:bg-muted/30 text-foreground'
              }`}
            >
              <Monitor className={`w-4 h-4 transition-colors ${
                theme === 'system' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              <span className="flex-1">Hệ thống</span>
              {theme === 'system' && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          </div>

          {/* Current Effective Theme Info */}
          {theme === 'system' && (
            <div className="px-4 py-2 mt-1 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                Đang dùng: <span className="font-medium text-foreground capitalize">{effectiveTheme}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
