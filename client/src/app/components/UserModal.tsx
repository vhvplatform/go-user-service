import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User } from './UserManagement';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
  user: User | null;
}

export function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'user' as User['role'],
    status: 'active' as User['status'],
    phone: '',
    department: '',
    lastLogin: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        phone: user.phone || '',
        department: user.department || '',
        lastLogin: user.lastLogin || ''
      });
    } else {
      setFormData({
        username: '',
        email: '',
        fullName: '',
        role: 'user',
        status: 'active',
        phone: '',
        department: '',
        lastLogin: ''
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username không được để trống';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-primary/0">
          <div>
            <h2 className="text-foreground">
              {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {user ? 'Cập nhật thông tin người dùng' : 'Điền thông tin để tạo người dùng mới'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-150 hover:scale-110"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-foreground">
                Username <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.username 
                    ? 'border-destructive focus:ring-destructive/20' 
                    : 'border-border focus:ring-primary/20 focus:border-primary'
                }`}
                placeholder="Nhập username"
              />
              {errors.username && (
                <p className="text-destructive text-sm animate-in slide-in-from-top-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-foreground">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email 
                    ? 'border-destructive focus:ring-destructive/20' 
                    : 'border-border focus:ring-primary/20 focus:border-primary'
                }`}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="text-destructive text-sm animate-in slide-in-from-top-1">{errors.email}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-foreground">
                Họ và tên <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.fullName 
                    ? 'border-destructive focus:ring-destructive/20' 
                    : 'border-border focus:ring-primary/20 focus:border-primary'
                }`}
                placeholder="Nhập họ và tên"
              />
              {errors.fullName && (
                <p className="text-destructive text-sm animate-in slide-in-from-top-1">{errors.fullName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-foreground">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-foreground">
                Phòng ban
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                placeholder="Nhập phòng ban"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-foreground">
                Vai trò <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer"
              >
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="user">Người dùng</option>
                <option value="guest">Khách</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-foreground">
                Trạng thái <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-border/40 bg-muted/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-foreground hover:bg-muted/50 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            {user ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
