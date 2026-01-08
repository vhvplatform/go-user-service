export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted/50 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-muted/30 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-muted/50 rounded-xl animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted/50 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 w-16 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-muted/30 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border/40 shadow-sm p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted/50 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-muted/30 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 relative mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
        </div>
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  );
}
