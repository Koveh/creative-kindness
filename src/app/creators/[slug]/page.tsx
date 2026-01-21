import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Creator {
  id: number
  name: string
  role: string
  image: string
  description: string
  link?: string
  slug?: string
  category?: string
}

async function getCreatorBySlug(slug: string): Promise<Creator | null> {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = process.env.URL || 'localhost:3004'
    const baseUrl = `${protocol}://${host}`
    
    const response = await fetch(`${baseUrl}/api/creators/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Failed to fetch creator:', error)
    return null
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CreatorSlugPage({ params }: Props) {
  const { slug } = await params
  const creator = await getCreatorBySlug(slug)
  
  if (!creator) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] lg:gap-[50px]">
        {/* Left 1/3: details */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-[24px] lg:text-[32px] font-medium text-primary leading-tight line-clamp-2">
              {creator.name}
            </h1>
            {creator.link && (
              <Link href={creator.link} className="text-primary hover:text-secondary text-[24px] lg:text-[32px]" aria-label="Перейти по ссылке">
                ↗
              </Link>
            )}
          </div>
          <h2 className="text-[20px] lg:text-[24px] text-secondary mb-3 leading-snug line-clamp-2">{creator.role}</h2>
          <p className="text-[16px] lg:text-[20px] text-primary leading-relaxed">
            {creator.description}
          </p>
        </div>

        {/* Right 2/3: image with overlay like creators grid */}
        <div className="lg:col-span-2">
          <div className="group relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
            <Image src={creator.image} alt={creator.name} fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2 text-white text-[12px] lg:text-[20px]">
                <span className="truncate">{creator.name}</span>
                <span>→</span>
              </div>
              <div className="text-[#B5B5B5] text-[12px] lg:text-[20px] leading-snug line-clamp-2">
                {creator.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


