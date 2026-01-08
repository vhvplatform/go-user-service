import { 
  FileText, Download, Calendar, Filter, TrendingUp, Users, Activity, Clock, Eye, Plus,
  Search, X, Settings, Share2, Bookmark, Star, FileSpreadsheet, FileImage, FilePdf,
  Send, Copy, CheckCircle, AlertCircle, Loader, ChevronDown, Grid, List, SortAsc
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'activity' | 'performance' | 'system' | 'security' | 'custom';
  period: string;
  generatedDate: string;
  status: 'ready' | 'generating' | 'scheduled' | 'failed';
  size: string;
  views: number;
  downloads: number;
  author: string;
  tags: string[];
  favorite: boolean;
}

export function AdvancedReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('date');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Báo cáo người dùng tháng 12/2024',
      description: 'Tổng quan về hoạt động và tăng trưởng người dùng trong tháng 12 với phân tích chi tiết theo nhóm',
      type: 'user',
      period: 'Tháng 12/2024',
      generatedDate: '2025-01-01',
      status: 'ready',
      size: '2.4 MB',
      views: 145,
      downloads: 23,
      author: 'Nguyễn Văn A',
      tags: ['monthly', 'users', 'growth'],
      favorite: true,
    },
    {
      id: '2',
      title: 'Phân tích hiệu suất Q4 2024',
      description: 'Báo cáo chi tiết về hiệu suất hệ thống, thời gian phản hồi và các chỉ số kỹ thuật trong quý 4',
      type: 'performance',
      period: 'Q4 2024',
      generatedDate: '2024-12-31',
      status: 'ready',
      size: '5.1 MB',
      views: 289,
      downloads: 45,
      author: 'Trần Thị B',
      tags: ['quarterly', 'performance', 'technical'],
      favorite: true,
    },
    {
      id: '3',
      title: 'Hoạt động hệ thống tuần 52',
      description: 'Thống kê hoạt động, sự kiện và logs hệ thống tuần 52/2024',
      type: 'activity',
      period: 'Tuần 52/2024',
      generatedDate: '2024-12-30',
      status: 'ready',
      size: '1.8 MB',
      views: 134,
      downloads: 18,
      author: 'Lê Văn C',
      tags: ['weekly', 'activity', 'logs'],
      favorite: false,
    },
    {
      id: '4',
      title: 'Báo cáo tổng quan năm 2024',
      description: 'Tổng hợp toàn bộ hoạt động, insights và dự báo cho năm 2025',
      type: 'system',
      period: 'Năm 2024',
      generatedDate: '2025-01-02',
      status: 'generating',
      size: '-',
      views: 0,
      downloads: 0,
      author: 'Phạm Thị D',
      tags: ['annual', 'comprehensive', 'forecast'],
      favorite: false,
    },
    {
      id: '5',
      title: 'Báo cáo bảo mật tháng 12',
      description: 'Chi tiết về các sự kiện bảo mật, đăng nhập bất thường và audit logs tháng 12/2024',
      type: 'security',
      period: 'Tháng 12/2024',
      generatedDate: '2025-01-03',
      status: 'ready',
      size: '3.2 MB',
      views: 78,
      downloads: 31,
      author: 'Hoàng Văn E',
      tags: ['monthly', 'security', 'audit'],
      favorite: true,
    },
    {
      id: '6',
      title: 'Báo cáo tùy chỉnh - Marketing',
      description: 'Báo cáo tùy chỉnh về chiến dịch marketing và conversion rates',
      type: 'custom',
      period: 'Q4 2024',
      generatedDate: '2024-12-28',
      status: 'ready',
      size: '4.5 MB',
      views: 92,
      downloads: 15,
      author: 'Võ Thị F',
      tags: ['custom', 'marketing', 'campaigns'],
      favorite: false,
    },
  ]);

  // Enhanced data
  const monthlyUserData = [
    { month: 'T7', users: 2100, target: 2000 },
    { month: 'T8', users: 2350, target: 2200 },
    { month: 'T9', users: 2580, target: 2400 },
    { month: 'T10', users: 2420, target: 2600 },
    { month: 'T11', users: 2680, target: 2800 },
    { month: 'T12', users: 2847, target: 3000 },
  ];

  const activityData = [
    { day: 'T2', logins: 420, actions: 1850, errors: 12 },
    { day: 'T3', logins: 480, actions: 2100, errors: 8 },
    { day: 'T4', logins: 450, actions: 1920, errors: 15 },
    { day: 'T5', logins: 520, actions: 2250, errors: 6 },
    { day: 'T6', logins: 490, actions: 2080, errors: 10 },
    { day: 'T7', logins: 280, actions: 950, errors: 4 },
    { day: 'CN', logins: 180, actions: 620, errors: 2 },
  ];

  const securityData = [
    { week: 'W1', success: 3420, failed: 12, blocked: 3 },
    { week: 'W2', success: 3680, failed: 8, blocked: 2 },
    { week: 'W3', success: 3590, failed: 15, blocked: 5 },
    { week: 'W4', success: 3850, failed: 6, blocked: 1 },
  ];

  const revenueData = [
    { week: 'W1', revenue: 45000, cost: 28000 },
    { week: 'W2', revenue: 52000, cost: 31000 },
    { week: 'W3', revenue: 48000, cost: 29000 },
    { week: 'W4', revenue: 61000, cost: 35000 },
  ];

  const filteredReports = reports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !report.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDownload = (reportId: string, title: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setReports(reports.map(r => 
        r.id === reportId ? { ...r, downloads: r.downloads + 1 } : r
      ));
    }
    toast.success(`Đang tải xuống: ${title}`);
  };

  const handleViewReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setReports(reports.map(r => 
        r.id === reportId ? { ...r, views: r.views + 1 } : r
      ));
    }
    toast.info('Đang mở báo cáo...');
  };

  const handleToggleFavorite = (reportId: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, favorite: !r.favorite } : r
    ));
    toast.success('Đã cập nhật báo cáo yêu thích');
  };

  const handleShareReport = (reportId: string, title: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/reports/${reportId}`);
    toast.success('Đã sao chép link chia sẻ');
  };

  const handleGenerateReport = () => {
    setShowCreateModal(true);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      user: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
      activity: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
      performance: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800',
      system: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800',
      security: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
      custom: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      ready: { 
        icon: CheckCircle, 
        color: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400', 
        text: 'Sẵn sàng' 
      },
      generating: { 
        icon: Loader, 
        color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400', 
        text: 'Đang tạo' 
      },
      scheduled: { 
        icon: Clock, 
        color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400', 
        text: 'Đã lên lịch' 
      },
      failed: { 
        icon: AlertCircle, 
        color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400', 
        text: 'Thất bại' 
      },
    };
    return configs[status as keyof typeof configs] || configs.ready;
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Enhanced Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Báo cáo nâng cao
          </h1>
          <p className="text-muted-foreground">
            Quản lý, tạo và phân tích các báo cáo về hoạt động hệ thống
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-muted/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <List className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Grid className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <button
            onClick={handleGenerateReport}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Tạo báo cáo mới
          </button>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { 
            title: 'Tổng báo cáo', 
            value: reports.length.toString(), 
            icon: FileText, 
            color: 'from-blue-500 to-blue-600',
            subtitle: `${reports.filter(r => r.favorite).length} yêu thích`
          },
          { 
            title: 'Sẵn sàng tải', 
            value: reports.filter(r => r.status === 'ready').length.toString(), 
            icon: Download, 
            color: 'from-green-500 to-green-600',
            subtitle: 'Có thể tải ngay'
          },
          { 
            title: 'Đã lên lịch', 
            value: reports.filter(r => r.status === 'scheduled').length.toString(), 
            icon: Clock, 
            color: 'from-orange-500 to-orange-600',
            subtitle: 'Chờ tạo'
          },
          { 
            title: 'Lượt xem', 
            value: reports.reduce((sum, r) => sum + r.views, 0).toString(), 
            icon: Eye, 
            color: 'from-purple-500 to-purple-600',
            subtitle: 'Tổng lượt xem'
          },
          { 
            title: 'Tải xuống', 
            value: reports.reduce((sum, r) => sum + r.downloads, 0).toString(), 
            icon: Download, 
            color: 'from-pink-500 to-pink-600',
            subtitle: 'Tổng lượt tải'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Preview Charts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Tăng trưởng người dùng</h3>
            <p className="text-sm text-muted-foreground mt-1">6 tháng gần đây</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyUserData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorUsers)"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Hoạt động tuần này</h3>
            <p className="text-sm text-muted-foreground mt-1">Đăng nhập và tương tác</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="logins" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="actions" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Doanh thu tháng này</h3>
            <p className="text-sm text-muted-foreground mt-1">So sánh revenue vs cost</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="Doanh thu" />
                  <Bar dataKey="cost" fill="#ef4444" radius={[8, 8, 0, 0]} name="Chi phí" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Bảo mật tuần này</h3>
            <p className="text-sm text-muted-foreground mt-1">Đăng nhập thành công & thất bại</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={securityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="success" fill="#10b981" radius={[8, 8, 0, 0]} name="Thành công" />
                  <Bar dataKey="failed" fill="#ef4444" radius={[8, 8, 0, 0]} name="Thất bại" />
                  <Bar dataKey="blocked" fill="#fbbf24" radius={[8, 8, 0, 0]} name="Đã chặn" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Bộ lọc:</span>
          </div>

          <div className="flex gap-2 flex-wrap flex-1">
            {[
              { value: 'all', label: 'Tất cả', count: reports.length },
              { value: 'user', label: 'Người dùng', count: reports.filter(r => r.type === 'user').length },
              { value: 'activity', label: 'Hoạt động', count: reports.filter(r => r.type === 'activity').length },
              { value: 'performance', label: 'Hiệu suất', count: reports.filter(r => r.type === 'performance').length },
              { value: 'security', label: 'Bảo mật', count: reports.filter(r => r.type === 'security').length },
              { value: 'custom', label: 'Tùy chỉnh', count: reports.filter(r => r.type === 'custom').length },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedType === type.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                {type.label}
                <span className="text-xs opacity-75">({type.count})</span>
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border" />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          >
            <option value="date">Mới nhất</option>
            <option value="views">Nhiều lượt xem</option>
            <option value="downloads">Nhiều lượt tải</option>
            <option value="title">Tên A-Z</option>
          </select>
        </div>
      </div>

      {/* Reports List/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
          <div className="divide-y divide-border/40">
            {filteredReports.map((report) => {
              const statusConfig = getStatusConfig(report.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={report.id}
                  className="p-6 hover:bg-muted/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {report.title}
                            </h3>
                            {report.favorite && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTypeColor(report.type)}`}>
                              {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${statusConfig.color}`}>
                              <StatusIcon className={`w-3.5 h-3.5 ${report.status === 'generating' ? 'animate-spin' : ''}`} />
                              {statusConfig.text}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              {report.period}
                            </span>
                            {report.status === 'ready' && (
                              <>
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <FileText className="w-3.5 h-3.5" />
                                  {report.size}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Eye className="w-3.5 h-3.5" />
                                  {report.views} lượt xem
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Download className="w-3.5 h-3.5" />
                                  {report.downloads} lượt tải
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {report.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleFavorite(report.id)}
                        className="p-2 hover:bg-muted/50 rounded-lg transition-all"
                        title={report.favorite ? "Bỏ yêu thích" : "Yêu thích"}
                      >
                        <Star className={`w-5 h-5 ${report.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      </button>
                      
                      {report.status === 'ready' && (
                        <>
                          <button
                            onClick={() => handleShareReport(report.id, report.title)}
                            className="p-2 hover:bg-muted/50 rounded-lg transition-all"
                            title="Chia sẻ"
                          >
                            <Share2 className="w-5 h-5 text-muted-foreground" />
                          </button>

                          <button
                            onClick={() => handleViewReport(report.id)}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Xem
                          </button>

                          <button
                            onClick={() => handleDownload(report.id, report.title)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Tải xuống
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const statusConfig = getStatusConfig(report.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={report.id}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTypeColor(report.type)}`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                    <button
                      onClick={() => handleToggleFavorite(report.id)}
                      className="p-1 hover:bg-muted/50 rounded-lg transition-all"
                    >
                      <Star className={`w-5 h-5 ${report.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                    </button>
                  </div>

                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${statusConfig.color}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${report.status === 'generating' ? 'animate-spin' : ''}`} />
                      {statusConfig.text}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {report.period}
                    </span>
                  </div>

                  {report.status === 'ready' && (
                    <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-t border-border/40">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{report.views}</div>
                        <div className="text-xs text-muted-foreground">Lượt xem</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{report.downloads}</div>
                        <div className="text-xs text-muted-foreground">Lượt tải</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{report.size}</div>
                        <div className="text-xs text-muted-foreground">Kích thước</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {report.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {report.status === 'ready' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewReport(report.id)}
                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Xem
                      </button>
                      <button
                        onClick={() => handleDownload(report.id, report.title)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Tải
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredReports.length === 0 && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Không tìm thấy báo cáo</h3>
          <p className="text-muted-foreground mb-6">
            Không có báo cáo nào phù hợp với bộ lọc của bạn
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSearchQuery('');
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}