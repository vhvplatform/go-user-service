/**
 * Notification Page - Full page view for notifications
 * Comprehensive notification management interface
 */

import { useState } from 'react';
import { Bell, Check, AlertCircle, Info, CheckCircle, Trash2, Filter, Search, Archive, Settings as SettingsIcon } from 'lucide-react';
import { formatRelativeTime, formatDateTime } from '@/utils/dateUtils';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'system' | 'security' | 'user' | 'task';
  actionUrl?: string;
}

export function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'User Created Successfully',
      message: 'John Doe has been successfully added to the system with admin privileges',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      category: 'user',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      category: 'security',
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update Available',
      message: 'VHV Platform v3.3.0 is now available with new features and bug fixes',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      category: 'system',
    },
    {
      id: '4',
      type: 'success',
      title: 'Task Completed',
      message: 'User migration task has been completed successfully',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
      category: 'task',
    },
    {
      id: '5',
      type: 'error',
      title: 'API Error',
      message: 'Failed to sync data with external service. Please check configuration.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false,
      category: 'system',
    },
    {
      id: '6',
      type: 'info',
      title: 'New User Registration',
      message: 'Jane Smith has registered and is waiting for approval',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      category: 'user',
    },
  ]);

  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'system' | 'security' | 'user' | 'task'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Filter by read status
    if (filterType === 'unread' && notification.read) return false;
    if (filterType === 'read' && !notification.read) return false;

    // Filter by category
    if (filterCategory !== 'all' && notification.category !== filterCategory) return false;

    // Filter by search query
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filter by Status */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Filter by Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="user">User</option>
            <option value="task">Task</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{unreadCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {notifications.length - unreadCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Archived</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">0</p>
            </div>
            <Archive className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery || filterType !== 'all' || filterCategory !== 'all'
                ? 'No notifications match your filters'
                : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`
                  p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50
                  ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-950/10 border-l-4 border-blue-500' : ''}
                `}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-lg ${getBgColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h3>
                        <span className={`
                          inline-block px-2 py-0.5 text-xs font-medium rounded-full
                          ${notification.category === 'system' ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' : ''}
                          ${notification.category === 'security' ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' : ''}
                          ${notification.category === 'user' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' : ''}
                          ${notification.category === 'task' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' : ''}
                        `}>
                          {notification.category}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-500">
                          {formatRelativeTime(notification.timestamp)}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-gray-500 dark:text-gray-500">
                          {formatDateTime(notification.timestamp)}
                        </span>
                      </div>

                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
