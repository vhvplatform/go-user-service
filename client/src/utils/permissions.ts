/**
 * Permission and Authorization Utilities
 * Role-based access control (RBAC) helpers
 */

import type { User } from '../services/api';

/**
 * User roles hierarchy (from highest to lowest)
 */
export const ROLE_HIERARCHY = {
  admin: 4,
  manager: 3,
  user: 2,
  guest: 1,
} as const;

/**
 * Permission types
 */
export type Permission =
  | 'user.create'
  | 'user.read'
  | 'user.update'
  | 'user.delete'
  | 'user.export'
  | 'user.import'
  | 'user.bulkDelete'
  | 'role.assign'
  | 'settings.view'
  | 'settings.update'
  | 'analytics.view'
  | 'reports.view'
  | 'reports.export'
  | 'system.manage';

/**
 * Role permissions mapping
 */
export const ROLE_PERMISSIONS: Record<User['role'], Permission[]> = {
  admin: [
    'user.create',
    'user.read',
    'user.update',
    'user.delete',
    'user.export',
    'user.import',
    'user.bulkDelete',
    'role.assign',
    'settings.view',
    'settings.update',
    'analytics.view',
    'reports.view',
    'reports.export',
    'system.manage',
  ],
  manager: [
    'user.create',
    'user.read',
    'user.update',
    'user.export',
    'analytics.view',
    'reports.view',
    'reports.export',
  ],
  user: [
    'user.read',
    'analytics.view',
    'reports.view',
  ],
  guest: [
    'user.read',
  ],
};

/**
 * Check if user has permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Check if user has specific role
 */
export function hasRole(user: User | null, role: User['role']): boolean {
  if (!user) return false;
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: User['role'][]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if user role is higher or equal to specified role
 */
export function hasMinimumRole(user: User | null, minimumRole: User['role']): boolean {
  if (!user) return false;
  
  const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
  const minimumRoleLevel = ROLE_HIERARCHY[minimumRole] || 0;
  
  return userRoleLevel >= minimumRoleLevel;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user is manager or higher
 */
export function isManagerOrHigher(user: User | null): boolean {
  return hasMinimumRole(user, 'manager');
}

/**
 * Check if user can manage other user (based on role hierarchy)
 */
export function canManageUser(currentUser: User | null, targetUser: User): boolean {
  if (!currentUser) return false;
  
  // Admins can manage anyone
  if (isAdmin(currentUser)) return true;
  
  // Users cannot manage themselves for role changes
  if (currentUser.id === targetUser.id) return false;
  
  // Check role hierarchy
  const currentUserLevel = ROLE_HIERARCHY[currentUser.role] || 0;
  const targetUserLevel = ROLE_HIERARCHY[targetUser.role] || 0;
  
  return currentUserLevel > targetUserLevel;
}

/**
 * Check if user can assign specific role
 */
export function canAssignRole(currentUser: User | null, roleToAssign: User['role']): boolean {
  if (!currentUser) return false;
  
  // Only admins and managers can assign roles
  if (!hasPermission(currentUser, 'role.assign')) return false;
  
  // Admins can assign any role
  if (isAdmin(currentUser)) return true;
  
  // Managers can only assign roles lower than their own
  const currentUserLevel = ROLE_HIERARCHY[currentUser.role] || 0;
  const roleToAssignLevel = ROLE_HIERARCHY[roleToAssign] || 0;
  
  return currentUserLevel > roleToAssignLevel;
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: User['role']): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Get highest role from array of roles
 */
export function getHighestRole(roles: User['role'][]): User['role'] | null {
  if (roles.length === 0) return null;
  
  return roles.reduce((highest, current) => {
    const highestLevel = ROLE_HIERARCHY[highest] || 0;
    const currentLevel = ROLE_HIERARCHY[current] || 0;
    return currentLevel > highestLevel ? current : highest;
  });
}

/**
 * Check if user account is active
 */
export function isUserActive(user: User | null): boolean {
  if (!user) return false;
  return user.status === 'active';
}

/**
 * Check if user can perform action
 * Combines permission check and active status check
 */
export function canPerformAction(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return isUserActive(user) && hasPermission(user, permission);
}

/**
 * Get user display role
 */
export function getRoleDisplay(role: User['role']): string {
  const roleDisplayMap: Record<User['role'], string> = {
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    user: 'Người dùng',
    guest: 'Khách',
  };
  
  return roleDisplayMap[role] || role;
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: User['role']): string {
  const colorMap: Record<User['role'], string> = {
    admin: 'bg-red-100 text-red-700 border-red-200',
    manager: 'bg-blue-100 text-blue-700 border-blue-200',
    user: 'bg-green-100 text-green-700 border-green-200',
    guest: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  
  return colorMap[role] || 'bg-gray-100 text-gray-700 border-gray-200';
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status: User['status']): string {
  const colorMap: Record<User['status'], string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
}

/**
 * Permission guard HOC helper
 */
export function checkPermissionGuard(
  user: User | null,
  requiredPermissions: Permission[],
  requireAll: boolean = false
): boolean {
  if (!user) return false;
  
  if (requireAll) {
    return hasAllPermissions(user, requiredPermissions);
  } else {
    return hasAnyPermission(user, requiredPermissions);
  }
}

export default {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasMinimumRole,
  isAdmin,
  isManagerOrHigher,
  canManageUser,
  canAssignRole,
  getPermissionsForRole,
  getHighestRole,
  isUserActive,
  canPerformAction,
  getRoleDisplay,
  getRoleBadgeColor,
  getStatusBadgeColor,
  checkPermissionGuard,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
};
