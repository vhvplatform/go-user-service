/**
 * Advanced Analytics Component
 * Real-time analytics dashboard with charts and metrics
 */

import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Clock,
  Calendar,
  Download,
} from 'lucide-react';

// Sample data
const userGrowthData = [
  { month: 'Jan', users: 400, active: 240, new: 80 },
  { month: 'Feb', users: 520, active: 380, new: 120 },
  { month: 'Mar', users: 680, active: 510, new: 160 },
  { month: 'Apr', users: 850, active: 680, new: 170 },
  { month: 'May', users: 1020, active: 820, new: 170 },
  { month: 'Jun', users: 1250, active: 1000, new: 230 },
];

const activityData = [
  { name: 'Mon', logins: 120, actions: 450 },
  { name: 'Tue', logins: 135, actions: 520 },
  { name: 'Wed', logins: 145, actions: 580 },
  { name: 'Thu', logins: 142, actions: 560 },
  { name: 'Fri', logins: 150, actions: 600 },
  { name: 'Sat', logins: 85, actions: 280 },
  { name: 'Sun', logins: 75, actions: 220 },
];

const roleDistribution = [
  { name: 'Admin', value: 12, color: '#3b82f6' },
  { name: 'Manager', value: 35, color: '#10b981' },
  { name: 'User', value: 142, color: '#f59e0b' },
  { name: 'Guest', value: 28, color: '#6b7280' },
];

const statusDistribution = [
  { name: 'Active', value: 185, color: '#10b981' },
  { name: 'Inactive', value: 25, color: '#f59e0b' },
  { name: 'Suspended', value: 7, color: '#ef4444' },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Real-time platform metrics and insights</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="1,250"
          change={12.5}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <MetricCard
          title="Active Users"
          value="1,000"
          change={8.3}
          icon={<Activity className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        <MetricCard
          title="New This Month"
          value="230"
          change={15.2}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
        />
        <MetricCard
          title="Avg Session Time"
          value="24.5 min"
          change={3.2}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          color="bg-orange-50"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Total Users"
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorActive)"
                name="Active Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="logins" fill="#3b82f6" name="Logins" radius={[8, 8, 0, 0]} />
              <Bar dataKey="actions" fill="#10b981" name="Actions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Users by Role
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Average Session Time</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">24.5 min</p>
          <p className="text-sm text-gray-600 mt-2">+3.2% from last week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Daily Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">847</p>
          <p className="text-sm text-gray-600 mt-2">+12.5% from yesterday</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">User Retention</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">87.3%</p>
          <p className="text-sm text-gray-600 mt-2">+2.1% from last month</p>
        </div>
      </div>
    </div>
  );
}

export default AdvancedAnalytics;