import { BarChart3, TrendingUp, Users, Activity, Calendar, Download, Filter } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState } from 'react';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7days');

  // User Activity by Hour
  const hourlyData = [
    { hour: '00:00', users: 45 },
    { hour: '03:00', users: 20 },
    { hour: '06:00', users: 35 },
    { hour: '09:00', users: 180 },
    { hour: '12:00', users: 240 },
    { hour: '15:00', users: 210 },
    { hour: '18:00', users: 195 },
    { hour: '21:00', users: 120 },
  ];

  // Device Distribution
  const deviceData = [
    { name: 'Desktop', value: 520, color: '#3b82f6' },
    { name: 'Mobile', value: 380, color: '#10b981' },
    { name: 'Tablet', value: 180, color: '#8b5cf6' },
    { name: 'Other', value: 45, color: '#6b7280' },
  ];

  // User Performance Metrics
  const performanceData = [
    { metric: 'Hiệu suất', A: 85, B: 75, fullMark: 100 },
    { metric: 'Hoạt động', A: 78, B: 90, fullMark: 100 },
    { metric: 'Tương tác', A: 92, B: 65, fullMark: 100 },
    { metric: 'Hoàn thành', A: 88, B: 80, fullMark: 100 },
    { metric: 'Chất lượng', A: 90, B: 85, fullMark: 100 },
  ];

  // Registration Trends
  const registrationData = [
    { month: 'T1', value: 145 },
    { month: 'T2', value: 180 },
    { month: 'T3', value: 220 },
    { month: 'T4', value: 195 },
    { month: 'T5', value: 280 },
    { month: 'T6', value: 310 },
    { month: 'T7', value: 275 },
    { month: 'T8', value: 340 },
  ];

  // Top Departments
  const departmentData = [
    { name: 'Phát triển', users: 245, color: '#3b82f6' },
    { name: 'Marketing', users: 180, color: '#10b981' },
    { name: 'Bán hàng', users: 165, color: '#8b5cf6' },
    { name: 'Vận hành', users: 140, color: '#f59e0b' },
    { name: 'HR', users: 95, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Phân tích nâng cao
          </h1>
          <p className="text-muted-foreground">
            Thống kê chi tiết và insights về người dùng trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="24hours">24 giờ qua</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
          </select>
          <button className="px-5 py-2.5 bg-white border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium">
            <Filter className="w-5 h-5" />
            Bộ lọc
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 font-medium">
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Tổng người dùng', value: '2,847', change: '+12.5%', trend: 'up', icon: Users, color: 'blue' },
          { title: 'Hoạt động', value: '1,892', change: '+8.2%', trend: 'up', icon: Activity, color: 'green' },
          { title: 'Tăng trưởng', value: '23.8%', change: '+3.1%', trend: 'up', icon: TrendingUp, color: 'purple' },
          { title: 'Trung bình/ngày', value: '124', change: '-2.4%', trend: 'down', icon: Calendar, color: 'orange' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
          };

          return (
            <div key={index} className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colors[stat.color as keyof typeof colors]} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Hourly Activity */}
        <div className="col-span-12 lg:col-span-8 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Hoạt động theo giờ</h3>
            <p className="text-sm text-muted-foreground mt-1">Số người dùng hoạt động trong ngày</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorUsers)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Thiết bị truy cập</h3>
            <p className="text-sm text-muted-foreground mt-1">Phân bố theo loại thiết bị</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                    <span className="text-sm text-foreground">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{device.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Trends */}
        <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Xu hướng đăng ký</h3>
            <p className="text-sm text-muted-foreground mt-1">Người dùng mới theo tháng</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Performance Radar */}
        <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Chỉ số hiệu suất</h3>
            <p className="text-sm text-muted-foreground mt-1">So sánh hiệu suất giữa các nhóm</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                  <PolarRadiusAxis stroke="#9ca3af" />
                  <Radar
                    name="Nhóm A"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    animationDuration={1500}
                  />
                  <Radar
                    name="Nhóm B"
                    dataKey="B"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    animationDuration={1500}
                  />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Departments */}
        <div className="col-span-12 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Top phòng ban</h3>
            <p className="text-sm text-muted-foreground mt-1">Phòng ban có nhiều người dùng nhất</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Bar
                    dataKey="users"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
