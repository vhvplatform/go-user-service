import { useState } from 'react';
import {
  X, Mail, Phone, MapPin, Shield, Calendar, Clock, Tag, User as UserIcon,
  Save, Trash2, AlertCircle, CheckCircle, Users, Building, Globe
} from 'lucide-react';
import { toast } from 'sonner';

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

// View User Modal
interface ViewUserModalProps {
  user: User;
  onClose: () => void;
}

export function ViewUserModal({ user, onClose }: ViewUserModalProps) {
  const roleConfig = {
    admin: { label: 'Quản trị viên', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    manager: { label: 'Quản lý', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    user: { label: 'Người dùng', color: 'bg-green-50 text-green-600 border-green-200' },
    guest: { label: 'Khách', color: 'bg-gray-50 text-gray-600 border-gray-200' }
  };

  const statusConfig = {
    active: { label: 'Hoạt động', color: 'bg-green-50 text-green-600 border-green-200', icon: CheckCircle },
    inactive: { label: 'Không hoạt động', color: 'bg-gray-50 text-gray-600 border-gray-200', icon: AlertCircle },
    suspended: { label: 'Tạm khóa', color: 'bg-red-50 text-red-600 border-red-200', icon: AlertCircle }
  };

  const StatusIcon = statusConfig[user.status].icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{user.fullName}</h2>
                <p className="text-white/80">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Role */}
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${roleConfig[user.role].color}`}>
              {roleConfig[user.role].label}
            </span>
            <span className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 ${statusConfig[user.status].color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig[user.status].label}
            </span>
          </div>

          {/* Contact Information */}
          <div className="bg-muted/30 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
              Thông tin liên hệ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <p className="text-foreground font-medium">{user.email}</p>
              </div>
              
              {user.phone && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Số điện thoại</label>
                  <p className="text-foreground font-medium">{user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Organization Information */}
          <div className="bg-muted/30 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-purple-600" />
              Thông tin tổ chức
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.department && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Phòng ban
                  </label>
                  <p className="text-foreground font-medium">{user.department}</p>
                </div>
              )}
              
              {user.location && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Vị trí
                  </label>
                  <p className="text-foreground font-medium">{user.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div className="bg-muted/30 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              Hoạt động
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ngày tham gia
                </label>
                <p className="text-foreground font-medium">
                  {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              
              {user.lastLogin && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Đăng nhập cuối
                  </label>
                  <p className="text-foreground font-medium">{user.lastLogin}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {user.tags.length > 0 && (
            <div className="bg-muted/30 rounded-xl p-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-orange-600" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-muted/30 border-t border-border p-6 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 rounded-xl transition-all font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit User Modal
interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    status: user.status,
    department: user.department || '',
    location: user.location || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(formData);
      toast.success('Cập nhật người dùng thành công!');
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Chỉnh sửa người dùng</h2>
              <p className="text-white/80">Cập nhật thông tin cho @{user.username}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Thông tin cơ bản
            </h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Vai trò & Trạng thái
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="admin">Quản trị viên</option>
                  <option value="manager">Quản lý</option>
                  <option value="user">Người dùng</option>
                  <option value="guest">Khách</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              Thông tin tổ chức
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phòng ban
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vị trí
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-muted/30 border-t border-border -mx-6 px-6 -mb-6 py-4 rounded-b-2xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 rounded-xl transition-all font-medium"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add User Modal
interface AddUserModalProps {
  onClose: () => void;
  onAdd: (newUser: Omit<User, 'id' | 'joinDate' | 'lastLogin' | 'lastActive' | 'tags'>) => void;
}

export function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'user' as User['role'],
    status: 'active' as User['status'],
    department: '',
    location: '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onAdd(formData);
      toast.success('Thêm người dùng thành công!');
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm người dùng!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Thêm người dùng mới</h2>
              <p className="text-white/80">Tạo tài khoản người dùng mới trong hệ thống</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Thông tin cơ bản
            </h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0901234567"
                />
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Vai trò & Trạng thái
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="user">Người dùng</option>
                  <option value="manager">Quản lý</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="guest">Khách</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              Thông tin tổ chức
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phòng ban
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="IT, Sales, Marketing..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vị trí
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Hà Nội, TP.HCM..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-muted/30 border-t border-border -mx-6 px-6 -mb-6 py-4 rounded-b-2xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 rounded-xl transition-all font-medium"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Thêm người dùng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ user, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onConfirm();
      toast.success('Đã xóa người dùng thành công!');
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa!');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-xl font-bold text-foreground text-center mb-2">
            Xác nhận xóa người dùng
          </h2>
          
          <p className="text-center text-muted-foreground mb-4">
            Bạn có chắc chắn muốn xóa người dùng này?
          </p>

          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 border-t border-border p-6 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 rounded-xl transition-all font-medium"
            disabled={deleting}
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Xóa người dùng
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
