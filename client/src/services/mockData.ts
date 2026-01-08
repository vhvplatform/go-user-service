import { User } from './api';

// Helper function to generate mock users
const generateMockUsers = (): User[] => {
  const firstNames = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi',
    'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Mai', 'Trương', 'Đinh', 'Huỳnh', 'Tô'
  ];
  
  const middleNames = [
    'Văn', 'Thị', 'Hữu', 'Đức', 'Minh', 'Anh', 'Thanh', 'Quốc', 'Hồng', 'Tuấn',
    'Thành', 'Phương', 'Thiên', 'Hoài', 'Bảo', 'Gia', 'Khánh', 'Duy', 'Trung', 'Nhật'
  ];
  
  const lastNames = [
    'An', 'Bình', 'Cường', 'Dũng', 'Đạt', 'Giang', 'Hải', 'Hòa', 'Hưng', 'Khôi',
    'Linh', 'Long', 'Mai', 'Nam', 'Phong', 'Quân', 'Sơn', 'Thắng', 'Trinh', 'Tú',
    'Tường', 'Uyên', 'Vân', 'Vinh', 'Xuân', 'Yến', 'Hà', 'Hiền', 'Khánh', 'Lan',
    'Ly', 'My', 'Nga', 'Oanh', 'Phúc', 'Quyên', 'Tâm', 'Thảo', 'Trâm', 'Vy'
  ];
  
  const departments = [
    'IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 
    'Customer Service', 'Product', 'Engineering', 'Design', 'Legal', 'R&D'
  ];
  
  const roles: User['role'][] = ['admin', 'manager', 'user', 'guest'];
  const statuses: User['status'][] = ['active', 'inactive', 'suspended'];
  
  const users: User[] = [];
  
  for (let i = 1; i <= 60; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const username = `user${i.toString().padStart(3, '0')}`;
    const email = `${username}@company.com`;
    
    // Weight distribution: more users, fewer admins
    let role: User['role'];
    const roleRand = Math.random();
    if (roleRand < 0.05) role = 'admin';
    else if (roleRand < 0.15) role = 'manager';
    else if (roleRand < 0.90) role = 'user';
    else role = 'guest';
    
    // Weight distribution: most active
    let status: User['status'];
    const statusRand = Math.random();
    if (statusRand < 0.80) status = 'active';
    else if (statusRand < 0.95) status = 'inactive';
    else status = 'suspended';
    
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Random dates in the last 12 months
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 365));
    
    const lastLoginDate = new Date();
    lastLoginDate.setDate(lastLoginDate.getDate() - Math.floor(Math.random() * 30));
    
    users.push({
      id: i.toString(),
      username,
      email,
      fullName,
      role,
      status,
      phone: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
      department,
      createdAt: createdDate.toISOString().split('T')[0],
      lastLogin: status === 'active' ? lastLoginDate.toISOString().split('T')[0] : undefined,
    });
  }
  
  return users;
};

// Mock Users Data - Generate 60 users
export const mockUsers: User[] = generateMockUsers();

// Mock Stats Data
export const mockStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter(u => u.status === 'active').length,
  newUsers: mockUsers.filter(u => {
    const created = new Date(u.createdAt);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return created > monthAgo;
  }).length,
  suspendedUsers: mockUsers.filter(u => u.status === 'suspended').length,
  stats: [
    {
      id: 1,
      title: 'Tổng người dùng',
      value: mockUsers.length.toString(),
      change: '+12.5%',
      trend: 'up',
      icon: 'Users',
      color: 'blue',
      chartData: [
        { value: 40 },
        { value: 45 },
        { value: 50 },
        { value: 52 },
        { value: 55 },
        { value: 58 },
        { value: 60 }
      ]
    },
    {
      id: 2,
      title: 'Người dùng hoạt động',
      value: mockUsers.filter(u => u.status === 'active').length.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: 'UserCheck',
      color: 'green',
      chartData: [
        { value: 35 },
        { value: 38 },
        { value: 40 },
        { value: 42 },
        { value: 45 },
        { value: 46 },
        { value: 48 }
      ]
    },
    {
      id: 3,
      title: 'Người dùng mới',
      value: mockUsers.filter(u => {
        const created = new Date(u.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created > monthAgo;
      }).length.toString(),
      change: '+23.1%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'purple',
      chartData: [
        { value: 5 },
        { value: 7 },
        { value: 8 },
        { value: 10 },
        { value: 12 },
        { value: 14 },
        { value: 15 }
      ]
    },
    {
      id: 4,
      title: 'Tài khoản bị khóa',
      value: mockUsers.filter(u => u.status === 'suspended').length.toString(),
      change: '-4.3%',
      trend: 'down',
      icon: 'UserX',
      color: 'red',
      chartData: [
        { value: 5 },
        { value: 4 },
        { value: 4 },
        { value: 3 },
        { value: 3 },
        { value: 2 },
        { value: 2 }
      ]
    }
  ]
};

// Mock Growth Data
export const mockGrowthData = [
  { month: 'T6', users: 35, active: 28 },
  { month: 'T7', users: 40, active: 32 },
  { month: 'T8', users: 45, active: 36 },
  { month: 'T9', users: 48, active: 38 },
  { month: 'T10', users: 52, active: 42 },
  { month: 'T11', users: 55, active: 44 },
  { month: 'T12', users: 58, active: 46 },
  { month: 'T1', users: 60, active: 48 }
];

// Mock Activities Data
export const mockActivities = [
  {
    id: 1,
    user: 'Nguyễn Văn An',
    action: 'Đăng nhập vào hệ thống',
    time: '2 phút trước',
    avatar: 'A',
    type: 'login'
  },
  {
    id: 2,
    user: 'Trần Thị Bình',
    action: 'Cập nhật thông tin cá nhân',
    time: '15 phút trước',
    avatar: 'B',
    type: 'update'
  },
  {
    id: 3,
    user: 'Lê Văn Cường',
    action: 'Đăng ký tài khoản mới',
    time: '1 giờ trước',
    avatar: 'C',
    type: 'register'
  },
  {
    id: 4,
    user: 'Phạm Thị Dung',
    action: 'Thay đổi mật khẩu',
    time: '2 giờ trước',
    avatar: 'D',
    type: 'security'
  },
  {
    id: 5,
    user: 'Hoàng Văn Đạt',
    action: 'Đăng xuất khỏi hệ thống',
    time: '3 giờ trước',
    avatar: 'Đ',
    type: 'logout'
  },
  {
    id: 6,
    user: 'Đặng Thị Giang',
    action: 'Cập nhật thông tin phòng ban',
    time: '4 giờ trước',
    avatar: 'G',
    type: 'update'
  }
];
