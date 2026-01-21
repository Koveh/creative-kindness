interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}></div>
        <div className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
    </div>
  )
}