import { Activity, User, Shield, FileText, Settings, Trash2, Edit, Eye, Download, Filter, Calendar, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  type: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'security' | 'system';
  timestamp: string;
  ip: string;
  details?: string;
}

export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const [logs] = useState<ActivityLog[]>([
    {
      id: '1',
      user: 'Nguyễn Văn Admin',
      userAvatar: 'A',
      action: 'Tạo người dùng mới',
      target: 'Trần Thị Mai',
      type: 'create',
      timestamp: '2025-01-02T14:30:00',
      ip: '192.168.1.100',
      details: 'Đã tạo tài khoản với vai trò User',
    },
    {
      id: '2',
      user: 'Lê Văn Manager',
      userAvatar: 'M',
      action: 'Cập nhật thông tin',
      target: 'Phạm Văn Hùng',
      type: 'update',
      timestamp: '2025-01-02T14:15:00',
      ip: '192.168.1.101',
      details: 'Đổi phòng ban từ Marketing sang Sales',
    },
    {
      id: '3',
      user: 'System',
      userAvatar: 'S',
      action: 'Backup database',
      target: 'Database tự động',
      type: 'system',
      timestamp: '2025-01-02T02:00:00',
      ip: '127.0.0.1',
      details: 'Sao lưu hoàn tất: 2.4 GB',
    },
    {
      id: '4',
      user: 'Nguyễn Thị User',
      userAvatar: 'U',
      action: 'Đăng nhập',
      target: 'Dashboard',
      type: 'login',
      timestamp: '2025-01-02T09:00:00',
      ip: '192.168.1.150',
    },
    {
      id: '5',
      user: 'Nguyễn Văn Admin',
      userAvatar: 'A',
      action: 'Xóa người dùng',
      target: 'Lê Thị Cũ',
      type: 'delete',
      timestamp: '2025-01-01T16:45:00',
      ip: '192.168.1.100',
      details: 'Người dùng không hoạt động > 90 ngày',
    },
    {
      id: '6',
      user: 'Trần Văn Security',
      userAvatar: 'S',
      action: 'Thay đổi quyền',
      target: 'Nguyễn Văn Bình',
      type: 'security',
      timestamp: '2025-01-01T15:30:00',
      ip: '192.168.1.102',
      details: 'Nâng cấp từ User lên Manager',
    },
    {
      id: '7',
      user: 'Phạm Thị HR',
      userAvatar: 'H',
      action: 'Xuất báo cáo',
      target: 'Báo cáo tháng 12',
      type: 'view',
      timestamp: '2025-01-01T14:00:00',
      ip: '192.168.1.103',
      details: 'Format: PDF, 156 trang',
    },
    {
      id: '8',
      user: 'System',
      userAvatar: 'S',
      action: 'Cập nhật hệ thống',
      target: 'Version 2.0.0',
      type: 'system',
      timestamp: '2025-01-01T03:00:00',
      ip: '127.0.0.1',
      details: 'Nâng cấp module User Management',
    },
    {
      id: '9',
      user: 'Lê Thị Guest',
      userAvatar: 'G',
      action: 'Đăng xuất',
      target: 'Hệ thống',
      type: 'logout',
      timestamp: '2024-12-31T18:00:00',
      ip: '192.168.1.105',
    },
    {
      id: '10',
      user: 'Nguyễn Văn Admin',
      userAvatar: 'A',
      action: 'Xem chi tiết',
      target: 'Hoàng Văn Test',
      type: 'view',
      timestamp: '2024-12-31T16:30:00',
      ip: '192.168.1.100',
    },
  ]);

  const filteredLogs = logs.filter(log => {
    if (typeFilter !== 'all' && log.type !== typeFilter) return false;
    if (searchQuery && !log.user.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.target.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <User className="w-4 h-4" />;
      case 'update':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'login':
        return <Shield className="w-4 h-4" />;
      case 'logout':
        return <Shield className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'update':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'delete':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'view':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'login':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'logout':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'security':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'system':
        return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'create':
        return 'Tạo mới';
      case 'update':
        return 'Cập nhật';
      case 'delete':
        return 'Xóa';
      case 'view':
        return 'Xem';
      case 'login':
        return 'Đăng nhập';
      case 'logout':
        return 'Đăng xuất';
      case 'security':
        return 'Bảo mật';
      case 'system':
        return 'Hệ thống';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} phút trước`;
    }
    if (hours < 24) return `${hours} giờ trước`;
    
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = () => {
    toast.success('Đang xuất lịch sử hoạt động...');
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
            Lịch sử hoạt động
          </h1>
          <p className="text-muted-foreground">
            Theo dõi tất cả hoạt động và thay đổi trong hệ thống
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 font-medium"
        >
          <Download className="w-5 h-5" />
          Xuất log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{logs.length}</p>
              <p className="text-sm text-muted-foreground">Tổng hoạt động</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {logs.filter(l => l.type === 'create').length}
              </p>
              <p className="text-sm text-muted-foreground">Tạo mới</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {logs.filter(l => l.type === 'security' || l.type === 'login').length}
              </p>
              <p className="text-sm text-muted-foreground">Bảo mật</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {logs.filter(l => l.type === 'system').length}
              </p>
              <p className="text-sm text-muted-foreground">Hệ thống</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng, hành động..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Loại:</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'create', label: 'Tạo mới' },
              { value: 'update', label: 'Cập nhật' },
              { value: 'delete', label: 'Xóa' },
              { value: 'security', label: 'Bảo mật' },
              { value: 'system', label: 'Hệ thống' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setTypeFilter(type.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === type.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          >
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
        <div className="divide-y divide-border/40">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Không có hoạt động</h3>
              <p className="text-muted-foreground">Không tìm thấy hoạt động nào phù hợp với bộ lọc</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-5 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
                    {log.userAvatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{log.user}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border flex items-center gap-1 ${getTypeColor(log.type)}`}>
                            {getTypeIcon(log.type)}
                            {getTypeLabel(log.type)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{log.action}</span>
                          {' '}→{' '}
                          <span className="font-medium text-foreground">{log.target}</span>
                        </p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {log.details}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">IP:</span>
                          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                            {log.ip}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
