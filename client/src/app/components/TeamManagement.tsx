import { Users, Plus, Edit, Trash2, Search, Filter, UserPlus, Crown, Shield, User as UserIcon, MoreVertical, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'admin' | 'member';
  avatar: string;
  status: 'active' | 'inactive';
  joinDate: string;
  department: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdDate: string;
  owner: string;
  color: string;
}

export function TeamManagement() {
  const [selectedTeam, setSelectedTeam] = useState<string>('team-1');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [teams] = useState<Team[]>([
    {
      id: 'team-1',
      name: 'Development Team',
      description: 'Core development and engineering team',
      memberCount: 12,
      createdDate: '2024-01-15',
      owner: 'Nguyễn Văn Admin',
      color: 'blue',
    },
    {
      id: 'team-2',
      name: 'Marketing Team',
      description: 'Marketing and growth team',
      memberCount: 8,
      createdDate: '2024-02-20',
      owner: 'Trần Thị Manager',
      color: 'purple',
    },
    {
      id: 'team-3',
      name: 'Sales Team',
      description: 'Sales and business development',
      memberCount: 15,
      createdDate: '2024-03-10',
      owner: 'Lê Văn Sales',
      color: 'green',
    },
    {
      id: 'team-4',
      name: 'HR Team',
      description: 'Human resources and recruitment',
      memberCount: 5,
      createdDate: '2024-04-05',
      owner: 'Phạm Thị HR',
      color: 'orange',
    },
  ]);

  const [members] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Nguyễn Văn Admin',
      email: 'admin@vhvplatform.com',
      phone: '+84 912 345 678',
      role: 'owner',
      avatar: 'A',
      status: 'active',
      joinDate: '2024-01-15',
      department: 'Engineering',
    },
    {
      id: '2',
      name: 'Trần Thị Manager',
      email: 'manager@vhvplatform.com',
      phone: '+84 987 654 321',
      role: 'admin',
      avatar: 'M',
      status: 'active',
      joinDate: '2024-01-20',
      department: 'Engineering',
    },
    {
      id: '3',
      name: 'Lê Văn Developer',
      email: 'dev1@vhvplatform.com',
      phone: '+84 901 234 567',
      role: 'member',
      avatar: 'D',
      status: 'active',
      joinDate: '2024-02-01',
      department: 'Engineering',
    },
    {
      id: '4',
      name: 'Phạm Thị Tester',
      email: 'tester@vhvplatform.com',
      phone: '+84 908 765 432',
      role: 'member',
      avatar: 'T',
      status: 'active',
      joinDate: '2024-02-15',
      department: 'QA',
    },
    {
      id: '5',
      name: 'Hoàng Văn Designer',
      email: 'designer@vhvplatform.com',
      phone: '+84 909 876 543',
      role: 'member',
      avatar: 'D',
      status: 'active',
      joinDate: '2024-03-01',
      department: 'Design',
    },
    {
      id: '6',
      name: 'Vũ Thị DevOps',
      email: 'devops@vhvplatform.com',
      phone: '+84 910 987 654',
      role: 'admin',
      avatar: 'D',
      status: 'active',
      joinDate: '2024-03-15',
      department: 'Infrastructure',
    },
    {
      id: '7',
      name: 'Đặng Văn Frontend',
      email: 'frontend@vhvplatform.com',
      phone: '+84 911 098 765',
      role: 'member',
      avatar: 'F',
      status: 'inactive',
      joinDate: '2024-04-01',
      department: 'Engineering',
    },
    {
      id: '8',
      name: 'Ngô Thị Backend',
      email: 'backend@vhvplatform.com',
      phone: '+84 912 109 876',
      role: 'member',
      avatar: 'B',
      status: 'active',
      joinDate: '2024-04-15',
      department: 'Engineering',
    },
  ]);

  const currentTeam = teams.find(t => t.id === selectedTeam);
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'admin':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Chủ sở hữu';
      case 'admin':
        return 'Quản trị';
      default:
        return 'Thành viên';
    }
  };

  const getTeamColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'purple':
        return 'from-purple-500 to-purple-600';
      case 'green':
        return 'from-green-500 to-green-600';
      case 'orange':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleAddMember = () => {
    setShowAddMember(false);
    toast.success('Đã thêm thành viên mới vào nhóm!');
  };

  const handleRemoveMember = (name: string) => {
    toast.success(`Đã xóa ${name} khỏi nhóm`);
  };

  const handleCreateTeam = () => {
    setShowCreateTeam(false);
    toast.success('Đã tạo nhóm mới!');
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
            Quản lý nhóm
          </h1>
          <p className="text-muted-foreground">
            Quản lý các nhóm làm việc và thành viên trong tổ chức
          </p>
        </div>
        <button
          onClick={() => setShowCreateTeam(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Tạo nhóm mới
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{teams.length}</p>
              <p className="text-sm text-muted-foreground">Tổng nhóm</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {teams.reduce((sum, t) => sum + t.memberCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Tổng thành viên</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {members.filter(m => m.role === 'admin' || m.role === 'owner').length}
              </p>
              <p className="text-sm text-muted-foreground">Quản trị viên</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {members.filter(m => m.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Teams List */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
            <div className="px-6 py-5 border-b border-border/40">
              <h3 className="text-lg font-semibold text-foreground">Danh sách nhóm</h3>
              <p className="text-sm text-muted-foreground mt-1">Chọn nhóm để xem chi tiết</p>
            </div>
            <div className="p-3 space-y-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.id)}
                  className={`w-full p-4 rounded-xl transition-all duration-200 text-left ${
                    selectedTeam === team.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-muted/30 hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getTeamColor(team.color)} rounded-lg flex items-center justify-center`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold truncate ${selectedTeam === team.id ? 'text-white' : 'text-foreground'}`}>
                        {team.name}
                      </h4>
                      <p className={`text-sm truncate ${selectedTeam === team.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {team.memberCount} thành viên
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team Details & Members */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Team Info */}
          {currentTeam && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
              <div className={`p-8 bg-gradient-to-r ${getTeamColor(currentTeam.color)} rounded-t-xl`}>
                <div className="flex items-start justify-between">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-2">{currentTeam.name}</h2>
                    <p className="text-white/90 mb-4">{currentTeam.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{currentTeam.memberCount} thành viên</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        <span>{currentTeam.owner}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Thành viên nhóm</h3>
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Thêm thành viên
                  </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm thành viên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-2">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 bg-muted/20 hover:bg-muted/30 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{member.name}</h4>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border flex items-center gap-1 ${getRoleColor(member.role)}`}>
                              {getRoleIcon(member.role)}
                              {getRoleLabel(member.role)}
                            </span>
                            {member.status === 'active' ? (
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-600">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-600">
                                Không hoạt động
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{member.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          {member.role !== 'owner' && (
                            <button
                              onClick={() => handleRemoveMember(member.name)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="p-6 border-b border-border/40">
              <h3 className="text-xl font-semibold text-foreground">Thêm thành viên mới</h3>
              <p className="text-sm text-muted-foreground mt-1">Thêm thành viên vào nhóm {currentTeam?.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email thành viên</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vai trò</label>
                <select className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="member">Thành viên</option>
                  <option value="admin">Quản trị</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-border/40 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddMember(false)}
                className="px-5 py-2.5 border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleAddMember}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
              >
                Thêm thành viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="p-6 border-b border-border/40">
              <h3 className="text-xl font-semibold text-foreground">Tạo nhóm mới</h3>
              <p className="text-sm text-muted-foreground mt-1">Tạo nhóm làm việc cho tổ chức</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tên nhóm</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Product Team"
                  className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả về nhóm..."
                  className="w-full px-4 py-2.5 bg-muted/30 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Màu nhóm</label>
                <div className="flex gap-3">
                  {['blue', 'purple', 'green', 'orange', 'red', 'cyan'].map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 bg-gradient-to-br ${getTeamColor(color)} rounded-lg hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border/40 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateTeam(false)}
                className="px-5 py-2.5 border border-border hover:bg-muted/50 text-foreground rounded-xl transition-all font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
