export default function ArticleSkeleton() {
  return (
    <article className="group animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Article Content - Left Side (1/3) */}
        <div className="lg:w-1/3 space-y-4">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-4/5"></div>
            <div className="h-6 bg-gray-200 rounded w-3/5"></div>
          </div>
          
          {/* Excerpt Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
          
          {/* Read More Link Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
          </div>
        </div>
        
        {/* Article Image - Right Side (2/3) */}
        <div className="lg:w-2/3">
          <div className="relative w-full h-64 lg:h-80 bg-gray-200 rounded-none"></div>
        </div>
      </div>
    </article>
  )
}