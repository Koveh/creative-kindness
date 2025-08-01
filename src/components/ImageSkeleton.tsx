import { Skeleton } from '@/components/ui/skeleton'

interface ImageSkeletonProps {
  width?: number
  height?: number
  className?: string
}

export default function ImageSkeleton({ 
  width = 300, 
  height = 200, 
  className = "" 
}: ImageSkeletonProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Skeleton 
        className="rounded-md"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  )
}

export function ArticleImageSkeleton() {
  return <ImageSkeleton width={400} height={250} className="mb-4" />
}

export function CreatorAvatarSkeleton() {
  return <ImageSkeleton width={80} height={80} className="rounded-full" />
}

export function TeamPhotoSkeleton() {
  return <ImageSkeleton width={300} height={200} className="mb-2" />
}