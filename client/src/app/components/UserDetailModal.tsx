import { X, Mail, Phone, Building2, Calendar, Clock, Shield, CheckCircle2, XCircle, AlertCircle, Pencil } from 'lucide-react';
import { User } from './UserManagement';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
}

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

const statusIcons: Record<User['status'], React.ComponentType<{ className?: string }>> = {
  active: CheckCircle2,
  inactive: XCircle,
  suspended: AlertCircle
};

const statusColors: Record<User['status'], string> = {
  active: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 dark:border-green-500/30',
  inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20 dark:border-gray-500/30',
  suspended: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20 dark:border-red-500/30'
};

export function UserDetailModal({ isOpen, onClose, user, onEdit }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const StatusIcon = statusIcons[user.status];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
      <div className="bg-card/95 dark:bg-card/98 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative px-6 py-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-all duration-150 hover:scale-110"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl font-semibold">{user.username[0].toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-foreground mb-2">{user.fullName}</h2>
              <p className="text-muted-foreground mb-3">@{user.username}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${roleColors[user.role]}`}>
                  <Shield className="w-4 h-4" />
                  {roleLabels[user.role]}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusColors[user.status]}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusLabels[user.status]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                Thông tin liên hệ
              </h3>
              <div className="space-y-3 pl-10">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Số điện thoại</p>
                      <p className="text-foreground font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phòng ban</p>
                      <p className="text-foreground font-medium">{user.department}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border/40" />

            {/* Activity Information */}
            <div>
              <h3 className="text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                Thông tin hoạt động
              </h3>
              <div className="space-y-3 pl-10">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tạo tài khoản</p>
                    <p className="text-foreground font-medium">{user.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Đăng nhập lần cuối</p>
                    <p className="text-foreground font-medium">{user.lastLogin || 'Chưa có thông tin'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/40" />

            {/* Statistics */}
            <div>
              <h3 className="text-foreground mb-4">Thống kê</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                  <p className="text-sm text-muted-foreground mb-1">Số ngày hoạt động</p>
                  <p className="text-foreground text-2xl font-semibold">
                    {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50">
                  <p className="text-sm text-muted-foreground mb-1">Dự án tham gia</p>
                  <p className="text-foreground text-2xl font-semibold">
                    {Math.floor(Math.random() * 10) + 1}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
                  <p className="text-sm text-muted-foreground mb-1">Nhiệm vụ hoàn thành</p>
                  <p className="text-foreground text-2xl font-semibold">
                    {Math.floor(Math.random() * 50) + 10}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-border/40 bg-muted/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-foreground hover:bg-muted/50 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onEdit(user);
              onClose();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}