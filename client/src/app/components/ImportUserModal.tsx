import { useState, useRef } from 'react';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface ImportUserModalProps {
  onClose: () => void;
  onImport: (file: File) => Promise<{ success: number; failed: number; errors: any[] }>;
  onDownloadTemplate: () => void;
}

export function ImportUserModal({ onClose, onImport, onDownloadTemplate }: ImportUserModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: any[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Vui lòng chọn file CSV');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.name.endsWith('.csv')) {
        toast.error('Vui lòng chọn file CSV');
        return;
      }
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file để import');
      return;
    }

    setImporting(true);
    try {
      const importResult = await onImport(file);
      setResult(importResult);
      
      if (importResult.failed === 0) {
        toast.success(`Import thành công ${importResult.success} người dùng!`);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.warning(`Import hoàn tất: ${importResult.success} thành công, ${importResult.failed} thất bại`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi import!');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Import người dùng</h2>
              <p className="text-white/80">Nhập danh sách người dùng từ file CSV</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={importing}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Tải file mẫu
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Tải xuống file CSV mẫu để xem định dạng và các trường bắt buộc
                </p>
                <button
                  onClick={onDownloadTemplate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Tải file mẫu
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Chọn file CSV <span className="text-red-500">*</span>
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                file
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                  : 'border-border hover:border-primary bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="space-y-3">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setResult(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Xóa file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Kéo thả file CSV vào đây
                    </p>
                    <p className="text-sm text-muted-foreground">
                      hoặc click để chọn file
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Chỉ chấp nhận file .csv
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Format Guide */}
          <div className="bg-muted/30 rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Hướng dẫn định dạng
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>File phải có các cột: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">username</code>, <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">email</code>, <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">fullName</code>, <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">role</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Role có thể là: admin, manager, user, guest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Status có thể là: active, inactive, suspended (mặc định: active)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Email và username phải là duy nhất</span>
              </li>
            </ul>
          </div>

          {/* Import Result */}
          {result && (
            <div className={`rounded-xl p-4 border ${
              result.failed === 0
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                : 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
            }`}>
              <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
                result.failed === 0 ? 'text-green-900 dark:text-green-100' : 'text-orange-900 dark:text-orange-100'
              }`}>
                {result.failed === 0 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                Kết quả import
              </h3>
              
              <div className="space-y-2 text-sm">
                <p className={result.failed === 0 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}>
                  ✓ Thành công: <strong>{result.success}</strong> người dùng
                </p>
                {result.failed > 0 && (
                  <p className="text-red-700 dark:text-red-300">
                    ✗ Thất bại: <strong>{result.failed}</strong> người dùng
                  </p>
                )}
              </div>

              {result.errors.length > 0 && (
                <div className="mt-4 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">
                    Chi tiết lỗi:
                  </p>
                  <div className="space-y-1">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-xs text-orange-700 dark:text-orange-300 bg-white/50 dark:bg-black/20 p-2 rounded">
                        Dòng {error.row}: {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-muted/30 border-t border-border p-6 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-border hover:bg-muted/50 rounded-xl transition-all font-medium"
            disabled={importing}
          >
            {result ? 'Đóng' : 'Hủy'}
          </button>
          {!result && (
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Import
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
