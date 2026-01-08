import { FileText, Download, Calendar, Filter, TrendingUp, Users, Activity, Clock, Eye, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'activity' | 'performance' | 'system';
  period: string;
  generatedDate: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
  views: number;
}

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedType, setSelectedType] = useState('all');

  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'Báo cáo người dùng tháng 12/2024',
      description: 'Tổng quan về hoạt động và tăng trưởng người dùng trong tháng 12',
      type: 'user',
      period: 'Tháng 12/2024',
      generatedDate: '2025-01-01',
      status: 'ready',
      size: '2.4 MB',
      views: 45,
    },
    {
      id: '2',
      title: 'Phân tích hiệu suất Q4 2024',
      description: 'Báo cáo chi tiết về hiệu suất hệ thống trong quý 4 năm 2024',
      type: 'performance',
      period: 'Q4 2024',
      generatedDate: '2024-12-31',
      status: 'ready',
      size: '5.1 MB',
      views: 89,
    },
    {
      id: '3',
      title: 'Hoạt động hệ thống tuần 52',
      description: 'Thống kê hoạt động và sự kiện hệ thống tuần 52/2024',
      type: 'activity',
      period: 'Tuần 52/2024',
      generatedDate: '2024-12-30',
      status: 'ready',
      size: '1.8 MB',
      views: 34,
    },
    {
      id: '4',
      title: 'Báo cáo tổng quan năm 2024',
      description: 'Tổng hợp toàn bộ hoạt động và insights của năm 2024',
      type: 'system',
      period: 'Năm 2024',
      generatedDate: '2025-01-02',
      status: 'generating',
      size: '-',
      views: 0,
    },
    {
      id: '5',
      title: 'Phân tích người dùng tuần 1/2025',
      description: 'Báo cáo hoạt động người dùng tuần đầu tiên năm 2025',
      type: 'user',
      period: 'Tuần 1/2025',
      generatedDate: '2025-01-08',
      status: 'scheduled',
      size: '-',
      views: 0,
    },
  ]);

  // Sample data for preview charts
  const monthlyUserData = [
    { month: 'T7', users: 2100 },
    { month: 'T8', users: 2350 },
    { month: 'T9', users: 2580 },
    { month: 'T10', users: 2420 },
    { month: 'T11', users: 2680 },
    { month: 'T12', users: 2847 },
  ];

  const activityData = [
    { day: 'T2', logins: 420, actions: 1850 },
    { day: 'T3', logins: 480, actions: 2100 },
    { day: 'T4', logins: 450, actions: 1920 },
    { day: 'T5', logins: 520, actions: 2250 },
    { day: 'T6', logins: 490, actions: 2080 },
    { day: 'T7', logins: 280, actions: 950 },
    { day: 'CN', logins: 180, actions: 620 },
  ];

  const filteredReports = reports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    return true;
  });

  const handleDownload = (reportId: string, title: string) => {
    toast.success(`Đang tải xuống: ${title}`);
  };

  const handleViewReport = (reportId: string) => {
    toast.info('Đang mở báo cáo...');
  };

  const handleGenerateReport = () => {
    toast.success('Đã tạo báo cáo mới. Bạn sẽ nhận thông báo khi hoàn tất.');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'activity':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'performance':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'system':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-50 text-green-600';
      case 'generating':
        return 'bg-orange-50 text-orange-600';
      case 'scheduled':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Sẵn sàng';
      case 'generating':
        return 'Đang tạo';
      case 'scheduled':
        return 'Đã lên lịch';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Báo cáo
          </h1>
          <p className="text-muted-foreground">
            Quản lý và tạo các báo cáo về hoạt động hệ thống
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Tạo báo cáo mới
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{reports.length}</p>
              <p className="text-sm text-muted-foreground">Tổng báo cáo</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {reports.filter(r => r.status === 'ready').length}
              </p>
              <p className="text-sm text-muted-foreground">Sẵn sàng tải</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {reports.filter(r => r.status === 'scheduled').length}
              </p>
              <p className="text-sm text-muted-foreground">Đã lên lịch</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {reports.reduce((sum, r) => sum + r.views, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Lượt xem</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Charts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          <div className="px-6 py-5 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">Tăng trưởng người dùng</h3>
            <p className="text-sm text-muted-foreground mt-1">6 tháng gần đây</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyUserData}>
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
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Bar dataKey="logins" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="actions" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Bộ lọc:</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'user', label: 'Người dùng' },
              { value: 'activity', label: 'Hoạt động' },
              { value: 'performance', label: 'Hiệu suất' },
              { value: 'system', label: 'Hệ thống' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === type.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border" />

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          >
            <option value="this-week">Tuần này</option>
            <option value="this-month">Tháng này</option>
            <option value="last-month">Tháng trước</option>
            <option value="this-quarter">Quý này</option>
            <option value="this-year">Năm này</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
        <div className="divide-y divide-border/40">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-6 hover:bg-muted/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTypeColor(report.type)}`}>
                          {report.type === 'user' ? 'Người dùng' :
                           report.type === 'activity' ? 'Hoạt động' :
                           report.type === 'performance' ? 'Hiệu suất' : 'Hệ thống'}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {report.status === 'ready' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewReport(report.id)}
                      className="px-4 py-2 bg-white border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
