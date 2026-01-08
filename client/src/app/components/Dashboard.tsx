import { Users, TrendingUp, Activity, Award, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { LoadingSkeleton } from './LoadingSpinner';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stats = [
    { id: 1, icon: Users, title: 'Người dùng mới', value: '1,234', change: '15%', trend: 'up', chartData: [{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }, { value: 35 }, { value: 40 }, { value: 45 }] },
    { id: 2, icon: TrendingUp, title: 'Tăng trưởng', value: '25%', change: '5%', trend: 'up', chartData: [{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }, { value: 35 }, { value: 40 }, { value: 45 }] },
    { id: 3, icon: Activity, title: 'Hoạt động', value: '500', change: '10%', trend: 'up', chartData: [{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }, { value: 35 }, { value: 40 }, { value: 45 }] },
    { id: 4, icon: Award, title: 'Giải thưởng', value: '10', change: '2%', trend: 'up', chartData: [{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }, { value: 35 }, { value: 40 }, { value: 45 }] }
  ];

  const growthData = [
    { month: 'Tháng 1', users: 100, active: 50 },
    { month: 'Tháng 2', users: 150, active: 75 },
    { month: 'Tháng 3', users: 200, active: 100 },
    { month: 'Tháng 4', users: 250, active: 125 },
    { month: 'Tháng 5', users: 300, active: 150 },
    { month: 'Tháng 6', users: 350, active: 175 },
    { month: 'Tháng 7', users: 400, active: 200 },
    { month: 'Tháng 8', users: 450, active: 225 }
  ];

  const roleDistributionData = [
    { name: 'Quản trị viên', value: 45, color: '#8b5cf6' },
    { name: 'Quản lý', value: 128, color: '#3b82f6' },
    { name: 'Người dùng', value: 2650, color: '#10b981' },
    { name: 'Khách', value: 24, color: '#6b7280' }
  ];

  const activityTypeColors: Record<string, string> = {
    login: 'bg-green-50 text-green-600',
    update: 'bg-blue-50 text-blue-600',
    register: 'bg-purple-50 text-purple-600',
    security: 'bg-orange-50 text-orange-600',
    logout: 'bg-gray-50 text-gray-600',
    upload: 'bg-cyan-50 text-cyan-600'
  };

  const activities = [
    { id: 1, user: 'Nguyễn Văn Admin', avatar: 'A', action: 'Đã cập nhật thông tin người dùng', type: 'update', time: '5 phút trước' },
    { id: 2, user: 'Trần Thị Manager', avatar: 'M', action: 'Đăng nhập vào hệ thống', type: 'login', time: '10 phút trước' },
    { id: 3, user: 'Lê Văn User', avatar: 'U', action: 'Đã đăng ký tài khoản mới', type: 'register', time: '15 phút trước' },
    { id: 4, user: 'Phạm Thị Security', avatar: 'S', action: 'Thay đổi mật khẩu', type: 'security', time: '20 phút trước' },
    { id: 5, user: 'Hoàng Văn Guest', avatar: 'G', action: 'Đăng xuất khỏi hệ thống', type: 'logout', time: '25 phút trước' },
    { id: 6, user: 'Vũ Thị Upload', avatar: 'U', action: 'Tải lên tệp tin mới', type: 'upload', time: '30 phút trước' }
  ];

  const colorMap = {
    blue: {
      bg: 'from-blue-50 to-blue-100/50',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
      text: 'text-blue-600',
      chart: '#3b82f6'
    },
    green: {
      bg: 'from-green-50 to-green-100/50',
      icon: 'bg-gradient-to-br from-green-500 to-green-600',
      text: 'text-green-600',
      chart: '#10b981'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100/50',
      icon: 'bg-gradient-to-br from-purple-500 to-purple-600',
      text: 'text-purple-600',
      chart: '#8b5cf6'
    },
    red: {
      bg: 'from-red-50 to-red-100/50',
      icon: 'bg-gradient-to-br from-red-500 to-red-600',
      text: 'text-red-600',
      chart: '#ef4444'
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-2">
            Chào mừng trở lại! 👋
          </h1>
          <p className="text-muted-foreground">
            Đây là tổng quan về hoạt động hệ thống của bạn
          </p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Xuất báo cáo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colorMap.blue.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
              
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${colorMap.blue.icon} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-muted-foreground text-sm">{stat.title}</p>
                <p className="text-foreground text-2xl font-semibold tracking-tight">{stat.value}</p>
              </div>

              {/* Mini Chart */}
              <div className="h-12 -mx-2 min-h-[48px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={48}>
                  <AreaChart data={stat.chartData}>
                    <defs>
                      <linearGradient id={`gradient-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colorMap.blue.chart} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={colorMap.blue.chart} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={colorMap.blue.chart}
                      strokeWidth={2}
                      fill={`url(#gradient-${stat.id})`}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="xl:col-span-2 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-foreground">Tăng trưởng người dùng</h2>
                <p className="text-muted-foreground text-sm mt-1">Biểu đồ tăng trưởng 8 tháng gần nhất</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">Tổng số</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">Hoạt động</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-80 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <defs>
                    <linearGradient id="gradientUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradientActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    style={{ fontSize: '14px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '14px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40">
            <h2 className="text-foreground">Phân bố vai trò</h2>
            <p className="text-muted-foreground text-sm mt-1">Thống kê theo vai trò người dùng</p>
          </div>
          <div className="p-6">
            <div className="h-80 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleDistributionData}>
                  <defs>
                    {roleDistributionData.map((entry, index) => (
                      <linearGradient key={index} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '14px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  >
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-foreground">Hoạt động gần đây</h2>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Theo dõi các hoạt động người dùng trong hệ thống</p>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-150 hover:underline flex items-center gap-1">
            Xem tất cả
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-border/40">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="px-6 py-4 hover:bg-muted/30 transition-colors duration-150 animate-in fade-in-0 slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-medium">{activity.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium">{activity.user}</p>
                  <p className="text-muted-foreground text-sm truncate">{activity.action}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${activityTypeColors[activity.type]}`}>
                    {activity.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm whitespace-nowrap">
                    <Clock className="w-4 h-4" />
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}