import loadingBlushGif from '../../../assets/loading-blush.gif?url';

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
  const sizeClasses: Record<NonNullable<LoadingProps['size']>, string> = {
    sm: 'w-16',
    md: 'w-24',
    lg: 'w-32'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <img
        src={loadingBlushGif}
        alt="Đang tải"
        className={`${sizeClasses[size]} h-auto animate-pulse drop-shadow-lg`}
      />
      {text && (
        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-center">
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