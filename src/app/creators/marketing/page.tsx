import { CreatorAvatarSkeleton } from '@/components/ImageSkeleton'

export default function MarketingCreatorsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-500">Креаторы</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium">Маркетинг</span>
      </div>
      
      <h1 className="text-3xl font-medium mb-8">Маркетинг</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <CreatorAvatarSkeleton />
              <div>
                <div className="h-5 bg-gray-200 rounded w-28 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}