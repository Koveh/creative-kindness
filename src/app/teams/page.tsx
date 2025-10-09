"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Team {
  id: number
  name: string
  category: string
  image: string
  description: string
  link?: string
  slug: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch('/api/teams', {
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          setTeams(data.teams || [])
        }
      } catch (error) {
        console.error('Error fetching teams:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeams()
  }, [])

  if (loading) {
    return <div className="w-full"><div className="text-center py-12">Загрузка...</div></div>
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] md:gap-[50px]">
        {teams.map((team) => (
          <div key={team.id} className="group">
            <Link href={`/teams/${team.slug}`} className="block">
              <div className="relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
                <Image
                  src={team.image}
                  alt={team.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-2 text-white text-[12px] md:text-[20px]">
                    <span className="truncate">{team.name}</span>
                    <span>→</span>
                  </div>
                  <div className="text-[#B5B5B5] text-[12px] md:text-[20px] leading-snug">
                    {team.description}
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
