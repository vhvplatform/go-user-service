import { 
  Users, TrendingUp, Activity, Award, ArrowUpRight, ArrowDownRight, Clock,
  Settings, RefreshCw, Download, ChevronRight, UserPlus, UserMinus, UserCheck,
  Plus, Calendar, MapPin, Shield, Star, CheckCircle, AlertCircle, XCircle,
  Eye, Mail, Phone
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LoadingSkeleton } from './LoadingSpinner';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  action: () => void;
}

export function AdvancedDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    totalUsers: 2847,
    newToday: 23,
    onlineNow: 156
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        newToday: prev.newToday + Math.floor(Math.random() * 2),
        onlineNow: Math.max(50, prev.onlineNow + Math.floor(Math.random() * 20 - 10))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info('Đang làm mới dữ liệu...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Dữ liệu đã được cập nhật');
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // User stats
  const stats = [
    { 
      id: 1, 
      icon: Users, 
      title: 'Tổng người dùng', 
      value: realTimeData.totalUsers.toLocaleString(), 
      change: '+12.5%', 
      trend: 'up',
      subtitle: `${realTimeData.activeUsers} hoạt động`,
      color: 'blue',
      chartData: [
        { value: 2100 }, { value: 2200 }, { value: 2350 }, { value: 2400 },
        { value: 2550 }, { value: 2680 }, { value: 2750 }, { value: 2847 }
      ]
    },
    { 
      id: 2, 
      icon: Activity, 
      title: 'Đang hoạt động', 
      value: realTimeData.activeUsers.toLocaleString(), 
      change: '+8.2%', 
      trend: 'up',
      subtitle: `${realTimeData.onlineNow} đang online`,
      color: 'green',
      chartData: [
        { value: 1000 }, { value: 1050 }, { value: 1100 }, { value: 1150 },
        { value: 1180 }, { value: 1210 }, { value: 1230 }, { value: 1247 }
      ]
    },
    { 
      id: 3, 
      icon: Activity, 
      title: 'Hoạt động', 
      value: '23', 
      change: '+8.7%', 
      trend: 'up',
      subtitle: 'Hôm nay',
      color: 'purple',
      chartData: [
        { value: 10 }, { value: 12 }, { value: 15 }, { value: 18 },
        { value: 19 }, { value: 21 }, { value: 22 }, { value: 23 }
      ]
    },
    { 
      id: 4, 
      icon: Award, 
      title: 'Điểm trung bình', 
      value: '78.4', 
      change: '+3.1%', 
      trend: 'up',
      subtitle: 'Điểm hoạt động',
      color: 'orange',
      chartData: [
        { value: 70 }, { value: 72 }, { value: 74 }, { value: 75 },
        { value: 76 }, { value: 77 }, { value: 77.5 }, { value: 78.4 }
      ]
    }
  ];

  // Quick actions for user management
  const quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Thêm người dùng',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      action: () => toast.success('Chuyển đến trang thêm người dùng')
    },
    {
      id: '2',
      label: 'Import người dùng',
      icon: Download,
      color: 'from-green-500 to-green-600',
      action: () => toast.info('Mở form import người dùng')
    },
    {
      id: '3',
      label: 'Xuất danh sách',
      icon: Download,
      color: 'from-purple-500 to-purple-600',
      action: () => toast.success('Đang xuất danh sách người dùng...')
    },
    {
      id: '4',
      label: 'Xem báo cáo',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      action: () => toast.info('Chuyển đến trang báo cáo người dùng')
    }
  ];

  // User growth data
  const userGrowthData = [
    { month: 'T1', total: 2100, active: 1800, new: 145 },
    { month: 'T2', total: 2200, active: 1850, new: 180 },
    { month: 'T3', total: 2350, active: 1920, new: 220 },
    { month: 'T4', total: 2400, active: 1950, new: 195 },
    { month: 'T5', total: 2550, active: 2100, new: 280 },
    { month: 'T6', total: 2680, active: 2200, new: 310 },
    { month: 'T7', total: 2750, active: 2250, new: 275 },
    { month: 'T8', total: 2847, active: 2350, new: 340 }
  ];

  // Role distribution
  const roleDistribution = [
    { name: 'Admin', value: 45, color: '#8b5cf6', percentage: 1.6 },
    { name: 'Manager', value: 128, color: '#3b82f6', percentage: 4.5 },
    { name: 'User', value: 2650, color: '#10b981', percentage: 93.1 },
    { name: 'Guest', value: 24, color: '#6b7280', percentage: 0.8 }
  ];

  // Status distribution
  const statusDistribution = [
    { name: 'Hoạt động', value: 2456, color: '#10b981', percentage: 86.3 },
    { name: 'Không hoạt động', value: 312, color: '#6b7280', percentage: 11.0 },
    { name: 'Tạm khóa', value: 79, color: '#ef4444', percentage: 2.7 }
  ];

  // Recent user activity
  const recentActivity = [
    { 
      id: 1, 
      user: 'Nguyễn Văn A', 
      action: 'Vừa đăng ký tài khoản mới', 
      type: 'register',
      time: '2 phút trước',
      avatar: 'A',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 2, 
      user: 'Trần Thị B', 
      action: 'Cập nhật thông tin cá nhân', 
      type: 'update',
      time: '5 phút trước',
      avatar: 'B',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 3, 
      user: 'Lê Văn C', 
      action: 'Đăng nhập vào hệ thống', 
      type: 'login',
      time: '8 phút trước',
      avatar: 'C',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 4, 
      user: 'Phạm Thị D', 
      action: 'Thay đổi mật khẩu', 
      type: 'security',
      time: '12 phút trước',
      avatar: 'D',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: 5, 
      user: 'Hoàng Văn E', 
      action: 'Cập nhật ảnh đại diện', 
      type: 'update',
      time: '15 phút trước',
      avatar: 'E',
      color: 'from-pink-500 to-pink-600'
    },
    { 
      id: 6, 
      user: 'Võ Thị F', 
      action: 'Đăng xuất khỏi hệ thống', 
      type: 'logout',
      time: '18 phút trước',
      avatar: 'F',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Top active users
  const topUsers = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      role: 'Admin', 
      activity: 245, 
      growth: 12,
      score: 95,
      avatar: 'A',
      department: 'IT',
      lastActive: '2 phút trước'
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      role: 'Manager', 
      activity: 189, 
      growth: 8,
      score: 88,
      avatar: 'B',
      department: 'Sales',
      lastActive: '5 phút trước'
    },
    { 
      id: 3, 
      name: 'Lê Văn C', 
      role: 'User', 
      activity: 156, 
      growth: 15,
      score: 82,
      avatar: 'C',
      department: 'Marketing',
      lastActive: '8 phút trước'
    },
    { 
      id: 4, 
      name: 'Phạm Thị D', 
      role: 'User', 
      activity: 142, 
      growth: -3,
      score: 75,
      avatar: 'D',
      department: 'HR',
      lastActive: '15 phút trước'
    },
    { 
      id: 5, 
      name: 'Hoàng Văn E', 
      role: 'Manager', 
      activity: 128, 
      growth: 5,
      score: 71,
      avatar: 'E',
      department: 'Support',
      lastActive: '20 phút trước'
    }
  ];

  // New users this week
  const newUsersThisWeek = [
    {
      id: 1,
      name: 'Vũ Thị G',
      email: 'vuthig@example.com',
      role: 'User',
      joinDate: 'Hôm nay',
      status: 'active',
      avatar: 'G'
    },
    {
      id: 2,
      name: 'Đặng Văn H',
      email: 'dangvanh@example.com',
      role: 'User',
      joinDate: 'Hôm qua',
      status: 'active',
      avatar: 'H'
    },
    {
      id: 3,
      name: 'Bùi Thị I',
      email: 'buithii@example.com',
      role: 'Guest',
      joinDate: '2 ngày trước',
      status: 'pending',
      avatar: 'I'
    },
    {
      id: 4,
      name: 'Phan Văn K',
      email: 'phanvank@example.com',
      role: 'User',
      joinDate: '3 ngày trước',
      status: 'active',
      avatar: 'K'
    }
  ];

  const colorMap = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      light: 'from-blue-50 to-blue-100/50',
      text: 'text-blue-600',
      chart: '#3b82f6'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      light: 'from-green-50 to-green-100/50',
      text: 'text-green-600',
      chart: '#10b981'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      light: 'from-purple-50 to-purple-100/50',
      text: 'text-purple-600',
      chart: '#8b5cf6'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      light: 'from-orange-50 to-orange-100/50',
      text: 'text-orange-600',
      chart: '#f59e0b'
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-2">
            Chào mừng trở lại! 👋
          </h1>
          <p className="text-muted-foreground">
            Tổng quan về người dùng trong hệ thống
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          >
            <option value="24h">24 giờ qua</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-foreground text-left">{action.label}</p>
            </button>
          );
        })}
      </div>

      {/* Real-time Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium text-foreground">Dữ liệu thời gian thực</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-muted-foreground">Online:</span>
              <span className="font-bold text-foreground">{realTimeData.onlineNow}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">Mới hôm nay:</span>
              <span className="font-bold text-foreground">{realTimeData.newToday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = colorMap[stat.color as keyof typeof colorMap];

          return (
            <div
              key={stat.id}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>

              <div className="mt-4 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.chartData}>
                    <defs>
                      <linearGradient id={`gradient-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.chart} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={colors.chart} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={colors.chart}
                      strokeWidth={2}
                      fill={`url(#gradient-${stat.id})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* User Growth Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Tăng trưởng người dùng</h3>
              <p className="text-sm text-muted-foreground mt-1">8 tháng gần đây</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                Tổng số
              </span>
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                Hoạt động
              </span>
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                Mới
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorTotal)"
                    name="Tổng số"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorActive)"
                    name="Hoạt động"
                  />
                  <Line
                    type="monotone"
                    dataKey="new"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    name="Người dùng mới"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Phân bố vai trò</h3>
            <p className="text-sm text-muted-foreground mt-1">Theo loại người dùng</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {roleDistribution.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    <span className="text-sm font-medium text-foreground">{role.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{role.percentage}%</span>
                    <span className="text-sm font-bold text-foreground">{role.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Trạng thái người dùng</h3>
            <p className="text-sm text-muted-foreground mt-1">Phân bố theo trạng thái</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {statusDistribution.map((status, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{status.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{status.percentage}%</span>
                      <span className="text-sm font-bold text-foreground">{status.value}</span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-muted/30">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${status.percentage}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">86.3%</p>
                  <p className="text-xs text-muted-foreground">Hoạt động</p>
                </div>
                <div>
                  <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">11.0%</p>
                  <p className="text-xs text-muted-foreground">Không hoạt động</p>
                </div>
                <div>
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">2.7%</p>
                  <p className="text-xs text-muted-foreground">Tạm khóa</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Hoạt động gần đây</h3>
            <p className="text-sm text-muted-foreground mt-1">Cập nhật theo thời gian thực</p>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Users This Week */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Người dùng mới</h3>
              <p className="text-sm text-muted-foreground mt-1">Tuần này</p>
            </div>
            <span className="px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
              +{newUsersThisWeek.length}
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {newUsersThisWeek.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">{user.role}</p>
                    <p className="text-xs text-muted-foreground">{user.joinDate}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl transition-colors font-medium">
              Xem tất cả người dùng mới →
            </button>
          </div>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Top người dùng hoạt động</h3>
            <p className="text-sm text-muted-foreground mt-1">5 người dùng hàng đầu tuần này</p>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Xem tất cả →
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topUsers.map((user, index) => (
              <div 
                key={user.id}
                className="p-4 rounded-xl border border-border hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {user.avatar}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
                      #{index + 1}
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{user.name}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{user.role}</p>
                  <p className="text-xs text-muted-foreground mb-3">{user.department}</p>
                  
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Điểm:</span>
                      <span className="font-bold text-foreground">{user.score}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hoạt động:</span>
                      <span className="font-bold text-foreground">{user.activity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tăng trưởng:</span>
                      <span className={`font-bold ${user.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {user.growth > 0 ? '+' : ''}{user.growth}%
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        {user.lastActive}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}