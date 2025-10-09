export const dynamic = 'force-dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Team {
  id: number
  name: string
  category: string
  image: string
  description: string
  link?: string
  slug: string
}

async function getTeam(slug: string): Promise<Team | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3009'}/api/teams/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.team
  } catch (error) {
    console.error('Error fetching team:', error)
    return null
  }
}

export default async function TeamSlugPage({ params }: { params: { slug: string } }) {
  const team = await getTeam(params.slug)
  
  if (!team) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] lg:gap-[50px]">
        {/* Left 1/3: details */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-[24px] lg:text-[32px] font-medium text-primary leading-tight line-clamp-2">
              {team.name}
            </h1>
            {team.link && (
              <Link href={team.link} className="text-primary hover:text-secondary text-[24px] lg:text-[32px]" aria-label="Перейти по ссылке">
                ↗
              </Link>
            )}
          </div>
          <h2 className="text-[20px] lg:text-[24px] text-secondary mb-3 leading-snug line-clamp-2">{team.category}</h2>
          <p className="text-[16px] lg:text-[20px] text-primary leading-relaxed">
            {team.description}
          </p>
        </div>

        {/* Right 2/3: image with overlay like teams grid */}
        <div className="lg:col-span-2">
          <div className="group relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
            <Image src={team.image} alt={team.name} fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2 text-white text-[12px] lg:text-[20px]">
                <span className="truncate">{team.name}</span>
                <span>→</span>
              </div>
              <div className="text-[#B5B5B5] text-[12px] lg:text-[20px] leading-snug line-clamp-2">
                {team.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


