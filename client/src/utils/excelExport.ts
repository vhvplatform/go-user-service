import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { User } from '../services/api';

/**
 * Excel Export/Import Utility
 * 
 * Provides functions to export/import user data to/from Excel files
 */

interface ExcelColumn {
  header: string;
  key: keyof User | string;
  width?: number;
}

const USER_COLUMNS: ExcelColumn[] = [
  { header: 'ID', key: 'id', width: 15 },
  { header: 'Username', key: 'username', width: 20 },
  { header: 'Email', key: 'email', width: 30 },
  { header: 'Full Name', key: 'fullName', width: 25 },
  { header: 'Role', key: 'role', width: 15 },
  { header: 'Status', key: 'status', width: 15 },
  { header: 'Phone', key: 'phone', width: 20 },
  { header: 'Department', key: 'department', width: 20 },
  { header: 'Created At', key: 'createdAt', width: 20 },
  { header: 'Last Login', key: 'lastLogin', width: 20 },
];

/**
 * Export users to Excel file
 */
export async function exportUsersToExcel(
  users: User[],
  filename: string = 'users-export.xlsx'
): Promise<void> {
  try {
    // Prepare data for export
    const data = users.map(user => ({
      'ID': user.id,
      'Username': user.username,
      'Email': user.email,
      'Full Name': user.fullName,
      'Role': user.role,
      'Status': user.status,
      'Phone': user.phone || '',
      'Department': user.department || '',
      'Created At': formatDate(user.createdAt),
      'Last Login': user.lastLogin ? formatDate(user.lastLogin) : 'Never',
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = USER_COLUMNS.map(col => ({ wch: col.width }));
    ws['!cols'] = columnWidths;

    // Style header row
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'FFE0E0E0' } },
      };
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Add metadata sheet
    const metaData = [
      ['Export Information'],
      ['Export Date', new Date().toISOString()],
      ['Total Records', users.length],
      ['Export By', 'VHV Platform User Management'],
      ['Version', '3.3.0'],
    ];
    const metaWs = XLSX.utils.aoa_to_sheet(metaData);
    XLSX.utils.book_append_sheet(wb, metaWs, 'Metadata');

    // Write file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
}

/**
 * Export selected users with custom columns
 */
export async function exportCustomExcel(
  users: User[],
  columns: string[],
  filename: string = 'custom-export.xlsx'
): Promise<void> {
  try {
    const selectedColumns = USER_COLUMNS.filter(col => 
      columns.includes(col.key as string)
    );

    const data = users.map(user => {
      const row: Record<string, any> = {};
      selectedColumns.forEach(col => {
        const value = user[col.key as keyof User];
        row[col.header] = value || '';
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting custom Excel:', error);
    throw new Error('Failed to export custom Excel');
  }
}

/**
 * Import users from Excel file
 */
export async function importUsersFromExcel(file: File): Promise<Partial<User>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
        
        // Map to User format
        const users: Partial<User>[] = jsonData.map(row => ({
          username: row['Username'] || row['username'],
          email: row['Email'] || row['email'],
          fullName: row['Full Name'] || row['fullName'] || row['full_name'],
          role: (row['Role'] || row['role'] || 'user') as User['role'],
          status: (row['Status'] || row['status'] || 'active') as User['status'],
          phone: row['Phone'] || row['phone'] || '',
          department: row['Department'] || row['department'] || '',
        }));

        // Validate data
        const validUsers = users.filter(user => 
          user.username && user.email && user.fullName
        );

        if (validUsers.length === 0) {
          reject(new Error('No valid users found in file'));
          return;
        }

        resolve(validUsers);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Download Excel template for user import
 */
export function downloadImportTemplate(): void {
  const templateData = [
    {
      'Username': 'john.doe',
      'Email': 'john.doe@example.com',
      'Full Name': 'John Doe',
      'Role': 'user',
      'Status': 'active',
      'Phone': '+84123456789',
      'Department': 'IT',
    },
    {
      'Username': 'jane.smith',
      'Email': 'jane.smith@example.com',
      'Full Name': 'Jane Smith',
      'Role': 'manager',
      'Status': 'active',
      'Phone': '+84987654321',
      'Department': 'Sales',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  
  // Set column widths
  ws['!cols'] = USER_COLUMNS.map(col => ({ wch: col.width }));

  // Add instructions sheet
  const instructions = [
    ['User Import Template Instructions'],
    [''],
    ['Required Fields:', 'Username, Email, Full Name'],
    ['Optional Fields:', 'Role, Status, Phone, Department'],
    [''],
    ['Valid Roles:', 'admin, manager, user, guest'],
    ['Valid Status:', 'active, inactive, suspended'],
    [''],
    ['Notes:'],
    ['- Username must be unique'],
    ['- Email must be valid email format'],
    ['- Role defaults to "user" if not specified'],
    ['- Status defaults to "active" if not specified'],
  ];
  const instructionsWs = XLSX.utils.aoa_to_sheet(instructions);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instructions');
  XLSX.utils.book_append_sheet(wb, ws, 'Users');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  saveAs(blob, 'user-import-template.xlsx');
}

/**
 * Export users to CSV
 */
export function exportUsersToCSV(users: User[], filename: string = 'users-export.csv'): void {
  try {
    const data = users.map(user => ({
      'ID': user.id,
      'Username': user.username,
      'Email': user.email,
      'Full Name': user.fullName,
      'Role': user.role,
      'Status': user.status,
      'Phone': user.phone || '',
      'Department': user.department || '',
      'Created At': formatDate(user.createdAt),
      'Last Login': user.lastLogin ? formatDate(user.lastLogin) : 'Never',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export to CSV');
  }
}

/**
 * Helper function to format date
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Validate imported user data
 */
export function validateImportedUsers(users: Partial<User>[]): {
  valid: Partial<User>[];
  invalid: Array<{ user: Partial<User>; errors: string[] }>;
} {
  const valid: Partial<User>[] = [];
  const invalid: Array<{ user: Partial<User>; errors: string[] }> = [];

  users.forEach(user => {
    const errors: string[] = [];

    // Required fields
    if (!user.username) errors.push('Username is required');
    if (!user.email) errors.push('Email is required');
    if (!user.fullName) errors.push('Full Name is required');

    // Email validation
    if (user.email && !isValidEmail(user.email)) {
      errors.push('Invalid email format');
    }

    // Role validation
    if (user.role && !['admin', 'manager', 'user', 'guest'].includes(user.role)) {
      errors.push('Invalid role');
    }

    // Status validation
    if (user.status && !['active', 'inactive', 'suspended'].includes(user.status)) {
      errors.push('Invalid status');
    }

    if (errors.length > 0) {
      invalid.push({ user, errors });
    } else {
      valid.push(user);
    }
  });

  return { valid, invalid };
}

/**
 * Email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default {
  exportUsersToExcel,
  exportCustomExcel,
  importUsersFromExcel,
  downloadImportTemplate,
  exportUsersToCSV,
  validateImportedUsers,
};
