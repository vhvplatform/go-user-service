import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in-0 zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <Icon className="w-10 h-10 text-muted-foreground/40" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
