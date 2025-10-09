export const dynamic = 'force-dynamic'
import Image from 'next/image'
import Link from 'next/link'

interface Creator {
  id: number
  name: string
  role: string
  image: string
  description: string
  link?: string
  slug: string
  category: string
}

async function getCreatorsByCategory(category: string): Promise<Creator[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3009'}/api/creators/category/${category}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.creators || []
  } catch (error) {
    console.error('Error fetching creators by category:', error)
    return []
  }
}

export default async function PhotoVideoCreatorsPage() {
  const creators = await getCreatorsByCategory('photo-video')

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] md:gap-[50px]">
        {creators.map((creator) => (
          <div key={creator.id} className="group">
            <Link href={`/creators/${creator.slug}`} className="block">
              <div className="relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
                <Image
                  src={creator.image}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
                {/* Overlay: visible on mobile, on hover on larger screens */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-2 text-white text-[12px] md:text-[20px]">
                    <span className="truncate">{creator.name}</span>
                    <span>→</span>
                  </div>
                  <div className="text-[#B5B5B5] text-[12px] md:text-[20px] leading-snug">
                    {creator.description}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}