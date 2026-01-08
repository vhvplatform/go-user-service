import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Filter, X, ChevronRight, Download, ArrowUpDown, ArrowUp, ArrowDown, Eye, Trash, Loader2, Users } from 'lucide-react';
import { UserModal } from './UserModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { UserDetailModal } from './UserDetailModal';
import { toast } from 'sonner';
import { userApi, User, UserFilters } from '../../services/api';

type SortField = 'username' | 'fullName' | 'email' | 'role' | 'status' | 'createdAt' | 'lastLogin';
type SortDirection = 'asc' | 'desc' | null;

const roleLabels: Record<User['role'], string> = {
  admin: 'Quản trị viên',
  manager: 'Quản lý',
  user: 'Người dùng',
  guest: 'Khách'
};

const statusLabels: Record<User['status'], string> = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  suspended: 'Tạm khóa'
};

const roleColors: Record<User['role'], string> = {
  admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 dark:border-purple-500/30',
  manager: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 dark:border-blue-500/30',
  user: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 dark:border-green-500/30',
  guest: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20 dark:border-gray-500/30'
};

const statusColors: Record<User['status'], string> = {
  active: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 dark:border-green-500/30',
  inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20 dark:border-gray-500/30',
  suspended: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20 dark:border-red-500/30'
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<User['status'] | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const filters: UserFilters = {
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField || undefined,
        sortOrder: sortDirection || undefined,
      };

      const response = await userApi.getUsers(filters);
      
      if (response.success) {
        setUsers(response.data);
        setTotalUsers(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } else {
        toast.error('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, searchTerm, roleFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    
    const count = selectedUsers.size;
    
    try {
      const response = await userApi.bulkDeleteUsers(Array.from(selectedUsers));
      
      if (response.success) {
        setSelectedUsers(new Set());
        fetchUsers();
        toast.success(`Đã xóa ${count} người dùng thành công`);
      } else {
        toast.error(response.error || 'Không thể xóa người dùng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  const handleExport = async () => {
    try {
      const filters: UserFilters = {
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await userApi.exportUsers(filters);
      
      if (response.success && response.data) {
        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast.success('Đã xuất dữ liệu thành công');
      } else {
        // Fallback to client-side export
        const csv = [
          ['Username', 'Họ tên', 'Email', 'Phòng ban', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Đăng nhập cuối'],
          ...users.map(u => [
            u.username,
            u.fullName,
            u.email,
            u.department || '',
            roleLabels[u.role],
            statusLabels[u.status],
            u.createdAt,
            u.lastLogin || ''
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        toast.success('Đã xuất dữ liệu thành công');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xuất dữ liệu');
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setIsDetailModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      if (editingUser) {
        const response = await userApi.updateUser(editingUser.id, userData);
        
        if (response.success) {
          fetchUsers();
          toast.success('Cập nhật người dùng thành công');
          setIsModalOpen(false);
        } else {
          toast.error(response.error || 'Không thể cập nhật người dùng');
        }
      } else {
        const response = await userApi.createUser({
          ...userData,
          password: 'default123', // You might want to add password field to the form
        });
        
        if (response.success) {
          fetchUsers();
          toast.success('Thêm người dùng mới thành công');
          setIsModalOpen(false);
        } else {
          toast.error(response.error || 'Không thể thêm người dùng');
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu người dùng');
    }
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    
    try {
      const response = await userApi.deleteUser(deletingUser.id);
      
      if (response.success) {
        fetchUsers();
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
        toast.success('Xóa người dùng thành công');
      } else {
        toast.error(response.error || 'Không thể xóa người dùng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  const hasActiveFilters = roleFilter !== 'all' || statusFilter !== 'all' || searchTerm !== '';

  const clearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-primary" />
      : <ArrowDown className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground">
            Quản lý toàn bộ thông tin người dùng trong hệ thống microservices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-5 py-2.5 bg-white border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Download className="w-5 h-5" />
            Xuất dữ liệu
          </button>
          <button
            onClick={handleAddUser}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as User['role'] | 'all');
                setCurrentPage(1);
              }}
              disabled={loading}
              className="pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none min-w-[180px] cursor-pointer disabled:opacity-50"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="manager">Quản lý</option>
              <option value="user">Người dùng</option>
              <option value="guest">Khách</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as User['status'] | 'all');
                setCurrentPage(1);
              }}
              disabled={loading}
              className="pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none min-w-[200px] cursor-pointer disabled:opacity-50"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Tạm khóa</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={loading}
              className="px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Results Count & Bulk Actions */}
        <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải...
              </span>
            ) : (
              <>
                Hiển thị <span className="text-foreground font-medium">{users.length}</span> / <span className="text-foreground font-medium">{totalUsers}</span> người dùng
                {selectedUsers.size > 0 && (
                  <span className="ml-4 text-primary font-medium">
                    • Đã chọn {selectedUsers.size} người dùng
                  </span>
                )}
              </>
            )}
          </p>
          
          {selectedUsers.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={loading}
              className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash className="w-4 h-4" />
              Xóa đã chọn ({selectedUsers.size})
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && users.every(u => selectedUsers.has(u.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={loading || users.length === 0}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                  />
                </th>
                <th 
                  className="px-6 py-4 text-left text-foreground cursor-pointer hover:bg-muted/30 transition-colors duration-150 group"
                  onClick={() => !loading && handleSort('username')}
                >
                  <div className="flex items-center gap-2">
                    Username
                    <SortIcon field="username" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-foreground cursor-pointer hover:bg-muted/30 transition-colors duration-150 group"
                  onClick={() => !loading && handleSort('fullName')}
                >
                  <div className="flex items-center gap-2">
                    Họ và tên
                    <SortIcon field="fullName" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-foreground cursor-pointer hover:bg-muted/30 transition-colors duration-150 group"
                  onClick={() => !loading && handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    <SortIcon field="email" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-foreground cursor-pointer hover:bg-muted/30 transition-colors duration-150 group"
                  onClick={() => !loading && handleSort('role')}
                >
                  <div className="flex items-center gap-2">
                    Vai trò
                    <SortIcon field="role" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-foreground cursor-pointer hover:bg-muted/30 transition-colors duration-150 group"
                  onClick={() => !loading && handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Trạng thái
                    <SortIcon field="status" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-foreground cursor-pointer hover:bg-muted/30 transition-colors duration-150 group"
                  onClick={() => !loading && handleSort('lastLogin')}
                >
                  <div className="flex items-center gap-2">
                    Đăng nhập cuối
                    <SortIcon field="lastLogin" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      <p className="text-foreground font-medium">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Không tìm thấy người dùng nào</p>
                        <p className="text-muted-foreground text-sm mt-1">Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-muted/30 transition-all duration-150 group animate-in fade-in-0 slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-white text-xs font-medium">{user.username[0].toUpperCase()}</span>
                        </div>
                        <span className="text-foreground font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-foreground">{user.fullName}</div>
                        {user.phone && (
                          <div className="text-muted-foreground text-sm mt-0.5">{user.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium border ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium border ${statusColors[user.status]}`}>
                        {statusLabels[user.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.lastLogin || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 hover:scale-110"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-150 hover:scale-110"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-150 hover:scale-110"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="px-6 py-4 border-t border-border/40 bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">mục mỗi trang</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-background border border-border rounded-lg text-sm hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                Trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm transition-all duration-150 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20'
                          : 'bg-background border border-border hover:bg-muted/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-background border border-border rounded-lg text-sm hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                Sau
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        userName={deletingUser?.fullName || ''}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={viewingUser}
        onEdit={handleEditUser}
      />
    </div>
  );
}