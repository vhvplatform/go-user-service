import { Activity, Cpu, HardDrive, Server, Zap, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Database, Wifi, Cloud } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: any;
  color: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: string;
  lastChecked: string;
}

export function SystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // CPU Usage data
  const [cpuData] = useState([
    { time: '00:00', value: 45 },
    { time: '04:00', value: 32 },
    { time: '08:00', value: 68 },
    { time: '12:00', value: 85 },
    { time: '16:00', value: 72 },
    { time: '20:00', value: 58 },
    { time: '23:59', value: 42 },
  ]);

  // Memory Usage data
  const [memoryData] = useState([
    { time: '00:00', value: 4.2 },
    { time: '04:00', value: 3.8 },
    { time: '08:00', value: 5.5 },
    { time: '12:00', value: 6.8 },
    { time: '16:00', value: 6.2 },
    { time: '20:00', value: 5.1 },
    { time: '23:59', value: 4.5 },
  ]);

  // Network Traffic data
  const [networkData] = useState([
    { time: '00:00', upload: 120, download: 450 },
    { time: '04:00', upload: 80, download: 320 },
    { time: '08:00', upload: 250, download: 890 },
    { time: '12:00', upload: 380, download: 1200 },
    { time: '16:00', upload: 320, download: 980 },
    { time: '20:00', upload: 210, download: 680 },
    { time: '23:59', upload: 150, download: 520 },
  ]);

  const [metrics] = useState<SystemMetric[]>([
    {
      label: 'CPU Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      icon: Cpu,
      color: 'orange',
    },
    {
      label: 'Memory',
      value: 6.2,
      unit: 'GB / 16 GB',
      status: 'good',
      icon: HardDrive,
      color: 'blue',
    },
    {
      label: 'Disk Usage',
      value: 245,
      unit: 'GB / 500 GB',
      status: 'good',
      icon: Database,
      color: 'green',
    },
    {
      label: 'Network',
      value: 320,
      unit: 'Mbps',
      status: 'good',
      icon: Wifi,
      color: 'purple',
    },
  ]);

  const [services] = useState<ServiceStatus[]>([
    {
      name: 'API Server',
      status: 'online',
      uptime: '99.98%',
      responseTime: '45ms',
      lastChecked: '2 phút trước',
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.95%',
      responseTime: '12ms',
      lastChecked: '2 phút trước',
    },
    {
      name: 'Redis Cache',
      status: 'online',
      uptime: '99.99%',
      responseTime: '3ms',
      lastChecked: '2 phút trước',
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: '99.92%',
      responseTime: '89ms',
      lastChecked: '2 phút trước',
    },
    {
      name: 'Email Service',
      status: 'degraded',
      uptime: '98.75%',
      responseTime: '1250ms',
      lastChecked: '2 phút trước',
    },
    {
      name: 'CDN',
      status: 'online',
      uptime: '99.97%',
      responseTime: '28ms',
      lastChecked: '2 phút trước',
    },
    {
      name: 'Authentication',
      status: 'online',
      uptime: '99.99%',
      responseTime: '35ms',
      lastChecked: '2 phút trước',
    },
    {
      name: 'Payment Gateway',
      status: 'online',
      uptime: '99.94%',
      responseTime: '156ms',
      lastChecked: '2 phút trước',
    },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'good':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'degraded':
      case 'warning':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'offline':
      case 'critical':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'offline':
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getMetricColor = (color: string) => {
    switch (color) {
      case 'orange':
        return 'from-orange-500 to-orange-600';
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'green':
        return 'from-green-500 to-green-600';
      case 'purple':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            Giám sát hệ thống
          </h1>
          <p className="text-muted-foreground">
            Theo dõi sức khỏe và hiệu suất của hệ thống real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-5 py-2.5 bg-white border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const percentage = typeof metric.value === 'number' && metric.unit === '%' ? metric.value : 
                            metric.label === 'Memory' ? (metric.value / 16) * 100 :
                            metric.label === 'Disk Usage' ? (245 / 500) * 100 : 0;

          return (
            <div key={index} className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getMetricColor(metric.color)} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(metric.status)} flex items-center gap-1`}>
                  {getStatusIcon(metric.status)}
                  {metric.status === 'good' ? 'Tốt' : metric.status === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground mb-1">{metric.unit}</p>
              </div>
              {/* Progress Bar */}
              {percentage > 0 && (
                <div className="mt-3 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getMetricColor(metric.color)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-6">
        {/* CPU Usage Chart */}
        <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">CPU Usage</h3>
            <p className="text-sm text-muted-foreground mt-1">Sử dụng CPU trong 24 giờ qua</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
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
                    dataKey="value"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fill="url(#colorCpu)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Memory Usage Chart */}
        <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Memory Usage</h3>
            <p className="text-sm text-muted-foreground mt-1">Sử dụng bộ nhớ trong 24 giờ qua</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={memoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
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
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Network Traffic */}
        <div className="col-span-12 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Network Traffic</h3>
            <p className="text-sm text-muted-foreground mt-1">Lưu lượng mạng upload/download</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkData}>
                  <defs>
                    <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
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
                    dataKey="upload"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorUpload)"
                  />
                  <Area
                    type="monotone"
                    dataKey="download"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#colorDownload)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
        <div className="px-6 py-5 border-b border-border/40">
          <h3 className="text-lg font-semibold text-foreground">Trạng thái dịch vụ</h3>
          <p className="text-sm text-muted-foreground mt-1">Tình trạng các microservices và dịch vụ</p>
        </div>
        <div className="divide-y divide-border/40">
          {services.map((service, index) => (
            <div key={index} className="px-6 py-4 hover:bg-muted/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg ${
                    service.status === 'online' ? 'bg-green-100' :
                    service.status === 'degraded' ? 'bg-orange-100' : 'bg-red-100'
                  } flex items-center justify-center`}>
                    <Server className={`w-5 h-5 ${
                      service.status === 'online' ? 'text-green-600' :
                      service.status === 'degraded' ? 'text-orange-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-foreground">{service.name}</h4>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(service.status)} flex items-center gap-1`}>
                        {getStatusIcon(service.status)}
                        {service.status === 'online' ? 'Online' : service.status === 'degraded' ? 'Degraded' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Uptime: {service.uptime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Response: {service.responseTime}</span>
                      </div>
                      <span className="text-xs">Kiểm tra: {service.lastChecked}</span>
                    </div>
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
