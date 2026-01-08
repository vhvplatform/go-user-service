import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, userName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-foreground">Xác nhận xóa</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-150 hover:scale-110"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-foreground">
            Bạn có chắc chắn muốn xóa người dùng{' '}
            <span className="font-semibold text-destructive">{userName}</span>?
          </p>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-foreground text-sm">
              ⚠️ Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-border/40 bg-muted/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-foreground hover:bg-muted/50 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-gradient-to-r from-destructive to-destructive/90 text-white rounded-lg hover:from-destructive/90 hover:to-destructive/80 transition-all duration-200 shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Xóa người dùng
          </button>
        </div>
      </div>
    </div>
  );
}
