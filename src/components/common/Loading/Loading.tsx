interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ 
  size = 'md', 
  text = 'Đang tải...', 
  className = '' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
        aria-label="Loading"
      ></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

// Skeleton loader for content
interface SkeletonProps {
  className?: string;
  rows?: number;
  height?: string;
}

export function Skeleton({ 
  className = '', 
  rows = 1, 
  height = 'h-4' 
}: SkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${height} ${
            i < rows - 1 ? 'mb-2' : ''
          }`}
        ></div>
      ))}
    </div>
  );
}

// Loading screen for full page
export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loading size="lg" text="Đang tải ứng dụng..." />
    </div>
  );
}

export default Loading;