'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import CreatorSkeleton from '@/components/CreatorSkeleton'

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

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-я0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export default function MarketingCreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch('/api/creators?category=маркетинг')
        if (response.ok) {
          const data = await response.json()
          // Deduplicate by name (case-insensitive)
          const uniqueCreators = data.filter((creator: Creator, index: number, self: Creator[]) => 
            index === self.findIndex((c: Creator) => 
              c.name.toLowerCase().trim() === creator.name.toLowerCase().trim()
            )
          )
          setCreators(uniqueCreators)
        }
      } catch (error) {
        console.error('Failed to fetch creators:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] md:gap-[50px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <CreatorSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] md:gap-[50px]">
        {creators.map((creator) => (
          <div key={creator.id} className="group">
            <div className="relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
              <Image
                src={creator.image || '/placeholder.jpg'}
                alt={creator.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-2 text-white text-[12px] md:text-[20px]">
                  <span className="truncate">{creator.name}</span>
                </div>
                <div className="text-[#B5B5B5] text-[12px] md:text-[20px] leading-snug">
                  {creator.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {creators.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-secondary">Креаторы не найдены</p>
        </div>
      )}
    </div>
  )
}