import { useState } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '../hooks/useTheme';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AdvancedDashboard } from './components/AdvancedDashboard';
import { UserManagement } from './components/UserManagement';
import { AdvancedUserManagement } from './components/AdvancedUserManagement';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { Analytics } from './components/Analytics';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { NotificationCenter } from './components/NotificationCenter';
import { NotificationPage } from './components/NotificationPage';
import { Reports } from './components/Reports';
import { AdvancedReports } from './components/AdvancedReports';
import { ActivityLogs } from './components/ActivityLogs';
import { TeamManagement } from './components/TeamManagement';
import { SystemHealth } from './components/SystemHealth';
import { DevelopmentBanner } from './components/DevelopmentBanner';
import { EnvironmentIndicator } from './components/EnvironmentIndicator';
import { ConfigurationWarningBanner } from './components/ConfigurationWarningBanner';
import { EnvironmentPanel } from './components/EnvironmentPanel';
import { ApiDemo } from './components/ApiDemo';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';

export type Page = 'dashboard' | 'users' | 'login' | 'settings' | 'profile' | 'analytics' | 'notifications' | 'reports' | 'activity-logs' | 'teams' | 'system-health' | 'api-demo';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="system">
        <LoginPage />
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: 'backdrop-blur-xl border-border/40',
              title: 'text-foreground',
              description: 'text-muted-foreground',
            },
          }}
        />

        {/* Ambient Background Gradients */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl transition-colors duration-300" />
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl transition-colors duration-300" />
        </div>

        {/* Header */}
        <Header onNavigate={handleNavigate} />

        {/* Sidebar */}
        <Sidebar currentView={currentPage} onViewChange={setCurrentPage} />

        {/* Main Content */}
        <div className="ml-64 mt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {currentPage === 'dashboard' && <AdvancedDashboard />}
            {currentPage === 'users' && <AdvancedUserManagement />}
            {currentPage === 'settings' && <Settings />}
            {currentPage === 'profile' && <Profile />}
            {currentPage === 'analytics' && <AdvancedAnalytics />}
            {currentPage === 'notifications' && <NotificationPage />}
            {currentPage === 'reports' && <AdvancedReports />}
            {currentPage === 'activity-logs' && <ActivityLogs />}
            {currentPage === 'teams' && <TeamManagement />}
            {currentPage === 'system-health' && <SystemHealth />}
            {currentPage === 'api-demo' && <ApiDemo />}
          </div>
        </div>

        {/* Environment Indicator (only in non-production) */}
        <EnvironmentIndicator />

        {/* Configuration Warning Banner - Compact version */}
        <ConfigurationWarningBanner />

        {/* Unified Environment Panel (replaces DevelopmentBanner + StartupCheck) */}
        <div data-environment-panel>
          <EnvironmentPanel />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;