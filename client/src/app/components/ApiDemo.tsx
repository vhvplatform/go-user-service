/**
 * API Demo Component
 * Demonstrates how to use all API services with both mock and real API
 */

import { useState } from 'react';
import { api } from '@/services/apiClient';
import { isUsingMockData, getCurrentEnvironment } from '@/config/apiConfig';
import { toast } from 'sonner';
import { 
  Code, 
  PlayCircle, 
  CheckCircle, 
  XCircle,
  Loader,
  Database,
  Server,
  AlertCircle
} from 'lucide-react';

export function ApiDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const useMock = isUsingMockData();
  const environment = getCurrentEnvironment();

  const runDemo = async (
    demoName: string,
    apiCall: () => Promise<any>
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiCall();
      setResult(response);
      toast.success(`${demoName} - Success!`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(`${demoName} - Failed!`);
    } finally {
      setLoading(false);
    }
  };

  const demos = [
    {
      category: '🔐 Authentication',
      items: [
        {
          name: 'Login',
          code: `api.auth.login({ 
  username: 'admin', 
  password: 'admin123' 
})`,
          run: () => api.auth.login({
            username: 'admin',
            password: 'admin123'
          })
        },
        {
          name: 'Get Current User',
          code: `api.auth.getCurrentUser()`,
          run: () => api.auth.getCurrentUser()
        },
        {
          name: 'Logout',
          code: `api.auth.logout()`,
          run: () => api.auth.logout()
        }
      ]
    },
    {
      category: '👥 User Management',
      items: [
        {
          name: 'Get Users (Paginated)',
          code: `api.user.getUsers({ 
  page: 1, 
  limit: 5,
  status: 'active' 
})`,
          run: () => api.user.getUsers({ page: 1, limit: 5, status: 'active' })
        },
        {
          name: 'Get User by ID',
          code: `api.user.getUserById('1')`,
          run: () => api.user.getUserById('1')
        },
        {
          name: 'Create User',
          code: `api.user.createUser({
  email: 'demo@example.com',
  username: 'demouser',
  password: 'password123',
  firstName: 'Demo',
  lastName: 'User',
  roleId: '3'
})`,
          run: () => api.user.createUser({
            email: `demo${Date.now()}@example.com`,
            username: `demo${Date.now()}`,
            password: 'password123',
            firstName: 'Demo',
            lastName: 'User',
            roleId: '3'
          })
        },
        {
          name: 'Search Users',
          code: `api.user.getUsers({ 
  search: 'john',
  limit: 5
})`,
          run: () => api.user.getUsers({ search: 'john', limit: 5 })
        },
        {
          name: 'Get User Statistics',
          code: `api.user.getUserStats()`,
          run: () => api.user.getUserStats()
        }
      ]
    },
    {
      category: '🎭 Role Management',
      items: [
        {
          name: 'Get All Roles',
          code: `api.role.getRoles(1, 10)`,
          run: () => api.role.getRoles(1, 10)
        },
        {
          name: 'Get Role by ID',
          code: `api.role.getRoleById('1')`,
          run: () => api.role.getRoleById('1')
        },
        {
          name: 'Get All Permissions',
          code: `api.role.getPermissions()`,
          run: () => api.role.getPermissions()
        }
      ]
    },
    {
      category: '📊 Analytics',
      items: [
        {
          name: 'Get Dashboard Data',
          code: `api.analytics.getDashboardData('7d')`,
          run: () => api.analytics.getDashboardData('7d')
        },
        {
          name: 'Get User Growth',
          code: `api.analytics.getUserGrowth('monthly')`,
          run: () => api.analytics.getUserGrowth('monthly')
        },
        {
          name: 'Get Activity Metrics',
          code: `api.analytics.getActivityMetrics('7d')`,
          run: () => api.analytics.getActivityMetrics('7d')
        },
        {
          name: 'Get Security Metrics',
          code: `api.analytics.getSecurityMetrics('30d')`,
          run: () => api.analytics.getSecurityMetrics('30d')
        },
        {
          name: 'Get Role Distribution',
          code: `api.analytics.getRoleDistribution()`,
          run: () => api.analytics.getRoleDistribution()
        }
      ]
    },
    {
      category: '🔔 Notifications',
      items: [
        {
          name: 'Get Notifications',
          code: `api.notification.getNotifications(1, 5)`,
          run: () => api.notification.getNotifications(1, 5)
        },
        {
          name: 'Get Unread Count',
          code: `api.notification.getUnreadCount()`,
          run: () => api.notification.getUnreadCount()
        },
        {
          name: 'Create Notification',
          code: `api.notification.createNotification({
  type: 'info',
  title: 'Test Notification',
  message: 'This is a test',
  userId: '1'
})`,
          run: () => api.notification.createNotification({
            type: 'info',
            title: 'Test Notification',
            message: 'This is a test notification from API demo',
            userId: '1'
          })
        }
      ]
    },
    {
      category: '📄 Reports',
      items: [
        {
          name: 'Get Reports',
          code: `api.report.getReports(1, 5)`,
          run: () => api.report.getReports(1, 5)
        },
        {
          name: 'Get Report by ID',
          code: `api.report.getReportById('1')`,
          run: () => api.report.getReportById('1')
        },
        {
          name: 'Create Report',
          code: `api.report.createReport({
  title: 'Demo Report',
  description: 'Test report',
  type: 'user',
  period: 'January 2025'
})`,
          run: () => api.report.createReport({
            title: 'Demo Report',
            description: 'Test report created from demo',
            type: 'user',
            period: 'January 2025',
            tags: ['demo', 'test']
          })
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 API Demo & Testing
          </h1>
          <p className="text-gray-600">
            Interactive demo of all API services. Click "Run" to test each endpoint.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This demo uses mock data. Enable mock mode in .env: 
              <code className="ml-2 px-2 py-1 bg-blue-100 rounded">VITE_USE_MOCK_API=true</code>
            </p>
          </div>
        </div>

        {/* Demo Categories */}
        <div className="grid grid-cols-1 gap-8">
          {demos.map((category) => (
            <div key={category.category} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.items.map((demo, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Code className="w-4 h-4 text-blue-600" />
                          {demo.name}
                        </h3>
                        <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto text-gray-700 font-mono">
                          {demo.code}
                        </pre>
                      </div>

                      <button
                        onClick={() => runDemo(demo.name, demo.run)}
                        disabled={loading}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4" />
                            Run
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results Panel */}
        {(result || error) && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              {error ? (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-900">Error</h3>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-900">Success</h3>
                </>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {error || JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Documentation Link */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">📚 Complete Documentation</h3>
          <p className="text-gray-700 mb-4">
            For detailed API documentation, integration guides, and examples, check out:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/docs/API_INTEGRATION_GUIDE.md" className="text-blue-600 hover:underline">
                → API Integration Guide
              </a>
            </li>
            <li>
              <a href="/docs/MOCK_API_README.md" className="text-blue-600 hover:underline">
                → Mock API Documentation
              </a>
            </li>
            <li>
              <a href="/docs/golang-api-structure.md" className="text-blue-600 hover:underline">
                → Backend API Structure (Golang)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}