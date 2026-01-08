import { useState, useEffect } from 'react';
import {
  Search, Plus, Pencil, Trash2, Filter, X, Download, Upload, ArrowUpDown,
  Eye, Users, Mail, Phone, Calendar, MapPin, Shield, Clock, Check,
  ChevronDown, MoreVertical, UserPlus, UserMinus, UserCheck, UserX,
  FileText, Send, Copy, RefreshCw, Settings, Grid3x3, List, Star,
  CheckSquare, Square, AlertCircle, TrendingUp, Activity, Award
} from 'lucide-react';
import { toast } from 'sonner';
import { ViewUserModal, EditUserModal, AddUserModal, DeleteConfirmModal } from './UserModals';
import { ImportUserModal } from './ImportUserModal';
import { userManagementAdapter } from '@/services/userManagementAdapter.service';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  location?: string;
  joinDate: string;
  lastLogin?: string;
  lastActive?: string;
  tags: string[];
}

type ViewMode = 'table' | 'grid' | 'compact';
type BulkAction = 'activate' | 'deactivate' | 'delete' | 'export' | 'email' | 'assign-role';

export function AdvancedUserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@vhvplatform.com',
      fullName: 'Nguyễn Văn Admin',
      phone: '0901234567',
      role: 'admin',
      status: 'active',
      department: 'IT',
      location: 'Hà Nội',
      joinDate: '2024-01-15',
      lastLogin: '2 phút trước',
      lastActive: '2 phút trước',
      tags: ['superuser', 'tech-lead']
    },
    {
      id: '2',
      username: 'manager01',
      email: 'manager@vhvplatform.com',
      fullName: 'Trần Thị Manager',
      phone: '0907654321',
      role: 'manager',
      status: 'active',
      department: 'Sales',
      location: 'TP.HCM',
      joinDate: '2024-02-20',
      lastLogin: '15 phút trước',
      lastActive: '15 phút trước',
      tags: ['sales-lead']
    },
    {
      id: '3',
      username: 'user01',
      email: 'user@vhvplatform.com',
      fullName: 'Lê Văn User',
      phone: '0909876543',
      role: 'user',
      status: 'active',
      department: 'Marketing',
      location: 'Đà Nẵng',
      joinDate: '2024-03-10',
      lastLogin: '1 giờ trước',
      lastActive: '1 giờ trước',
      tags: ['content-creator']
    },
    {
      id: '4',
      username: 'inactive01',
      email: 'inactive@vhvplatform.com',
      fullName: 'Phạm Thị Inactive',
      role: 'user',
      status: 'inactive',
      department: 'HR',
      location: 'Hải Phòng',
      joinDate: '2024-04-05',
      lastLogin: '2 tuần trước',
      lastActive: '2 tuần trước',
      tags: []
    },
    {
      id: '5',
      username: 'guest01',
      email: 'guest@vhvplatform.com',
      fullName: 'Hoàng Văn Guest',
      role: 'guest',
      status: 'active',
      department: null,
      location: 'Cần Thơ',
      joinDate: '2024-12-01',
      lastLogin: '5 phút trước',
      lastActive: '5 phút trước',
      tags: ['trial']
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Modal states
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userManagementAdapter.getUsers({ page: 1, limit: 100 });
      setUsers(response.data);
    } catch (error: any) {
      console.error('Error loading users:', error);
      // Keep initial mock data if API fails
      toast.error('Đang sử dụng dữ liệu mẫu (API chưa kết nối)');
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = [
    {
      label: 'Tổng người dùng',
      value: users.length,
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Hoạt động',
      value: users.filter(u => u.status === 'active').length,
      change: '+8.2%',
      icon: Activity,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Đang hoạt động',
      value: users.filter(u => {
        const lastActive = new Date(u.lastActive || '');
        const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceActive <= 7;
      }).length,
      change: '+15.3%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  // Toggle all users selection
  const toggleAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  // Bulk actions
  const handleBulkAction = (action: BulkAction) => {
    const count = selectedUsers.size;
    
    switch (action) {
      case 'activate':
        toast.success(`Đã kích hoạt ${count} người dùng`);
        break;
      case 'deactivate':
        toast.success(`Đã vô hiệu hóa ${count} người dùng`);
        break;
      case 'delete':
        toast.success(`Đã xóa ${count} người dùng`);
        break;
      case 'export':
        toast.success(`Đang xuất dữ liệu ${count} người dùng...`);
        break;
      case 'email':
        toast.success(`Đang gửi email đến ${count} người dùng...`);
        break;
      case 'assign-role':
        toast.info(`Chọn vai trò mới cho ${count} người dùng`);
        break;
    }
    
    setSelectedUsers(new Set());
    setShowBulkActions(false);
  };

  // User handlers
  const handleAddUser = async (newUserData: any) => {
    try {
      const createdUser = await userManagementAdapter.createUser(newUserData);
      setUsers([createdUser, ...users]);
      toast.success('Thêm người dùng thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi thêm người dùng!');
      throw error;
    }
  };

  const handleEditUser = async (updatedData: Partial<User>) => {
    if (!editingUser) return;
    
    try {
      const updatedUser = await userManagementAdapter.updateUser(editingUser.id, updatedData);
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      toast.success('Cập nhật người dùng thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật!');
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    try {
      await userManagementAdapter.deleteUser(deletingUser.id);
      setUsers(users.filter(u => u.id !== deletingUser.id));
      toast.success('Xóa người dùng thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa!');
      throw error;
    }
  };

  // Import/Export handlers
  const handleExport = async () => {
    try {
      await userManagementAdapter.exportUsers({
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      toast.success('Đã xuất file thành công!');
    } catch (error: any) {
      toast.error('Có lỗi khi xuất file!');
    }
  };

  const handleImport = async (file: File) => {
    const result = await userManagementAdapter.importUsers(file);
    await loadUsers(); // Reload danh sách sau khi import
    return result;
  };

  const handleDownloadTemplate = () => {
    userManagementAdapter.downloadImportTemplate();
  };

  // Role & Status configs
  const roleConfig = {
    admin: { label: 'Quản trị viên', color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30' },
    manager: { label: 'Quản lý', color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30' },
    user: { label: 'Người dùng', color: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30' },
    guest: { label: 'Khách', color: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/30' }
  };

  const statusConfig = {
    active: { label: 'Hoạt động', color: 'bg-green-50 text-green-600 border-green-200', icon: CheckSquare },
    inactive: { label: 'Không hoạt động', color: 'bg-gray-50 text-gray-600 border-gray-200', icon: Square },
    suspended: { label: 'Tạm khóa', color: 'bg-red-50 text-red-600 border-red-200', icon: AlertCircle }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            Quản lý người dùng nâng cao
          </h1>
          <p className="text-muted-foreground">
            Quản lý toàn diện với bulk actions, import/export và phân tích chi tiết
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-xl transition-all flex items-center gap-2 font-medium"
          >
            <Upload className="w-5 h-5" />
            Import
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-xl transition-all flex items-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            Export
          </button>

          <button
            onClick={() => setShowUserModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode */}
          <div className="flex bg-muted/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-xl transition-all flex items-center gap-2 font-medium"
          >
            <Filter className="w-5 h-5" />
            Bộ lọc
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vai trò</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="manager">Quản lý</option>
                  <option value="user">Người dùng</option>
                  <option value="guest">Khách</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Trạng thái</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>

              <div className="flex-1" />

              <button
                onClick={() => {
                  setRoleFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Đã chọn {selectedUsers.size} người dùng
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <UserCheck className="w-4 h-4" />
                Kích hoạt
              </button>

              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <UserX className="w-4 h-4" />
                Vô hiệu hóa
              </button>

              <button
                onClick={() => handleBulkAction('email')}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Gửi email
              </button>

              <button
                onClick={() => handleBulkAction('export')}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-border hover:bg-muted/50 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Xuất
              </button>

              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List/Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllUsers}
                      className="w-4 h-4 rounded border-border"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Người dùng</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Liên hệ</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Vai trò</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Trạng thái</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Phòng ban</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Hoạt động cuối</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${roleConfig[user.role].color}`}>
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusConfig[user.status].color}`}>
                        {statusConfig[user.status].label}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{user.department || '-'}</p>
                      {user.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {user.lastLogin || 'Chưa đăng nhập'}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingUser(user)}
                          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Không tìm thấy người dùng</h3>
              <p className="text-muted-foreground mb-6">
                Không có người dùng nào phù hợp với bộ lọc của bạn
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                  className="w-4 h-4 rounded border-border"
                />
                <button className="p-1 hover:bg-muted/50 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3">
                  {user.fullName.charAt(0)}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${roleConfig[user.role].color}`}>
                    {roleConfig[user.role].label}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusConfig[user.status].color}`}>
                    {statusConfig[user.status].label}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>{user.department}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.lastLogin && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{user.lastLogin}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewingUser(user)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Xem
                </button>
                <button
                  onClick={() => setEditingUser(user)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showUserModal && (
        <AddUserModal
          onClose={() => setShowUserModal(false)}
          onAdd={handleAddUser}
        />
      )}

      {viewingUser && (
        <ViewUserModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditUser}
        />
      )}

      {deletingUser && (
        <DeleteConfirmModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDeleteUser}
        />
      )}

      {showImportModal && (
        <ImportUserModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
          onDownloadTemplate={handleDownloadTemplate}
        />
      )}
    </div>
  );
}