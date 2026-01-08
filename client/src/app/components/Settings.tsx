import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Save, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'VHV Platform',
    siteDescription: 'Microservices Framework for Enterprise',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    monthlyReport: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    
    // Appearance Settings
    theme: 'light',
    compactMode: false,
    sidebarCollapsed: false,
  });

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'Cài đặt chung',
      description: 'Cấu hình cơ bản của hệ thống',
      icon: SettingsIcon,
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      description: 'Quản lý thông báo và cảnh báo',
      icon: Bell,
    },
    {
      id: 'security',
      title: 'Bảo mật',
      description: 'Cài đặt bảo mật và quyền truy cập',
      icon: Shield,
    },
    {
      id: 'appearance',
      title: 'Giao diện',
      description: 'Tùy chỉnh giao diện người dùng',
      icon: Palette,
    },
  ];

  const handleSave = () => {
    // Simulate API call
    toast.success('Đã lưu cài đặt thành công!');
  };

  const handleReset = () => {
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình và tùy chọn của hệ thống VHV Platform
          </p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/40 bg-muted/20">
              <h3 className="font-semibold text-foreground">Danh mục</h3>
            </div>
            <div className="p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                        {section.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content - Settings Panel */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <SettingsIcon className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Cài đặt chung</h2>
                    <p className="text-sm text-muted-foreground">Cấu hình cơ bản của hệ thống</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tên hệ thống
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mô tả hệ thống
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Múi giờ
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
                        <option value="Asia/Bangkok">Bangkok (UTC+7)</option>
                        <option value="Asia/Singapore">Singapore (UTC+8)</option>
                        <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Ngôn ngữ
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <Bell className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Cài đặt thông báo</h2>
                    <p className="text-sm text-muted-foreground">Quản lý thông báo và cảnh báo</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Email thông báo</h3>
                      <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Push notifications</h3>
                      <p className="text-sm text-muted-foreground">Thông báo trên trình duyệt</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Báo cáo tuần</h3>
                      <p className="text-sm text-muted-foreground">Nhận báo cáo hàng tuần</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weeklyReport}
                        onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Báo cáo tháng</h3>
                      <p className="text-sm text-muted-foreground">Nhận báo cáo hàng tháng</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.monthlyReport}
                        onChange={(e) => setSettings({ ...settings, monthlyReport: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <Shield className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Cài đặt bảo mật</h2>
                    <p className="text-sm text-muted-foreground">Cấu hình bảo mật và quyền truy cập</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Cảnh báo bảo mật</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Các thay đổi về bảo mật sẽ ảnh hưởng đến tất cả người dùng trong hệ thống.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Xác thực 2 yếu tố</h3>
                      <p className="text-sm text-muted-foreground">Bật xác thực 2 lớp cho tài khoản</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Thời gian hết hạn phiên (phút)
                    </label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="15">15 phút</option>
                      <option value="30">30 phút</option>
                      <option value="60">1 giờ</option>
                      <option value="120">2 giờ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Thời hạn mật khẩu (ngày)
                    </label>
                    <select
                      value={settings.passwordExpiry}
                      onChange={(e) => setSettings({ ...settings, passwordExpiry: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="30">30 ngày</option>
                      <option value="60">60 ngày</option>
                      <option value="90">90 ngày</option>
                      <option value="180">180 ngày</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <Palette className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Cài đặt giao diện</h2>
                    <p className="text-sm text-muted-foreground">Tùy chỉnh giao diện người dùng</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Chủ đề
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSettings({ ...settings, theme })}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            settings.theme === theme
                              ? 'border-primary bg-primary/5'
                              : 'border-border/40 hover:border-border'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-lg ${
                              theme === 'light' ? 'bg-white border-2 border-gray-300' :
                              theme === 'dark' ? 'bg-gray-900 border-2 border-gray-700' :
                              'bg-gradient-to-br from-white via-gray-200 to-gray-900'
                            }`} />
                            <span className="text-sm font-medium capitalize">{
                              theme === 'light' ? 'Sáng' :
                              theme === 'dark' ? 'Tối' : 'Tự động'
                            }</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Chế độ thu gọn</h3>
                      <p className="text-sm text-muted-foreground">Giảm khoảng cách giữa các phần tử</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.compactMode}
                        onChange={(e) => setSettings({ ...settings, compactMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Thu gọn sidebar</h3>
                      <p className="text-sm text-muted-foreground">Sidebar luôn thu gọn khi tải trang</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.sidebarCollapsed}
                        onChange={(e) => setSettings({ ...settings, sidebarCollapsed: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-border/40 bg-muted/10 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
              >
                Khôi phục mặc định
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
