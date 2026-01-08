import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Camera, Save, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    avatar: '',
    fullName: 'Nguyễn Văn Admin',
    username: 'admin',
    email: 'admin@vhvplatform.com',
    phone: '+84 912 345 678',
    department: 'Phát triển hệ thống',
    position: 'Quản trị viên hệ thống',
    location: 'Hà Nội, Việt Nam',
    joinDate: '2024-01-15',
    bio: 'Quản trị viên hệ thống VHV Platform với hơn 5 năm kinh nghiệm trong việc phát triển và vận hành các hệ thống microservices quy mô lớn.',
  });

  const [stats] = useState([
    { label: 'Tổng dự án', value: '24', icon: Briefcase, color: 'blue' },
    { label: 'Nhiệm vụ hoàn thành', value: '156', icon: Shield, color: 'green' },
    { label: 'Ngày hoạt động', value: '342', icon: Calendar, color: 'purple' },
  ]);

  const [activities] = useState([
    { date: '2025-01-02', action: 'Cập nhật hệ thống User Management', type: 'update' },
    { date: '2025-01-01', action: 'Thêm 15 người dùng mới vào hệ thống', type: 'create' },
    { date: '2024-12-30', action: 'Xuất báo cáo tháng 12/2024', type: 'export' },
    { date: '2024-12-28', action: 'Cấu hình lại phân quyền cho module CRM', type: 'config' },
    { date: '2024-12-25', action: 'Backup database thành công', type: 'backup' },
  ]);

  const handleSave = () => {
    toast.success('Đã cập nhật thông tin cá nhân!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.info('Đã hủy chỉnh sửa');
  };

  const handleAvatarUpload = () => {
    toast.info('Tính năng upload ảnh sẽ sớm được triển khai');
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <User className="w-6 h-6 text-white" />
            </div>
            Hồ sơ cá nhân
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và hoạt động của bạn
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Profile Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Avatar Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                    <span className="text-white text-4xl font-bold">
                      {profile.fullName.charAt(0)}
                    </span>
                  </div>
                  {isEditing && (
                    <button
                      onClick={handleAvatarUpload}
                      className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-foreground">{profile.fullName}</h2>
                <p className="text-muted-foreground">@{profile.username}</p>
                <div className="mt-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {profile.position}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/40 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.department}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Tham gia {profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                blue: 'from-blue-500 to-blue-600',
                green: 'from-green-500 to-green-600',
                purple: 'from-purple-500 to-purple-600',
              };

              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm p-4 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colors[stat.color as keyof typeof colors]} rounded-xl flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Details & Activity */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Profile Details */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
            <div className="px-6 py-5 border-b border-border/40">
              <h3 className="text-lg font-semibold text-foreground">Thông tin chi tiết</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Thông tin cá nhân và liên hệ của bạn
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  ) : (
                    <p className="text-foreground py-2.5">{profile.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tên đăng nhập
                  </label>
                  <p className="text-muted-foreground py-2.5">@{profile.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  ) : (
                    <p className="text-foreground py-2.5">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  ) : (
                    <p className="text-foreground py-2.5">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phòng ban
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  ) : (
                    <p className="text-foreground py-2.5">{profile.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Vị trí
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.position}
                      onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  ) : (
                    <p className="text-foreground py-2.5">{profile.position}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-foreground py-2.5">{profile.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Giới thiệu
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                ) : (
                  <p className="text-foreground py-2.5">{profile.bio}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
            <div className="px-6 py-5 border-b border-border/40">
              <h3 className="text-lg font-semibold text-foreground">Hoạt động gần đây</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Lịch sử các hoạt động của bạn trong hệ thống
              </p>
            </div>

            <div className="divide-y divide-border/40">
              {activities.map((activity, index) => {
                const typeColors = {
                  update: 'bg-blue-50 text-blue-600',
                  create: 'bg-green-50 text-green-600',
                  export: 'bg-purple-50 text-purple-600',
                  config: 'bg-orange-50 text-orange-600',
                  backup: 'bg-cyan-50 text-cyan-600',
                };

                return (
                  <div
                    key={index}
                    className="px-6 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeColors[activity.type as keyof typeof typeColors]}`}>
                        {activity.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
