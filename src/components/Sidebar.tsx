'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface SubMenuItem {
  name: string
  href: string
}

interface MenuItem {
  name: string
  href: string
  submenu?: SubMenuItem[]
}

const mainNavItems: MenuItem[] = [
  { name: 'креативное добро', href: '/' },
  { name: 'журнал', href: '/journal' },
  { 
    name: 'креаторы', 
    href: '/creators',
    submenu: [
      { name: 'маркетинг', href: '/creators/marketing' },
      { name: 'фото/видео', href: '/creators/photo-video' },
      { name: 'дизайнеры', href: '/creators/designers' },
      { name: 'менеджеры', href: '/creators/managers' },
      { name: 'инфлюенсеры', href: '/creators/influencers' }
    ]
  },
  { 
    name: 'команды', 
    href: '/teams',
    submenu: [
      { name: 'студии', href: '/teams/studios' },
      { name: 'компании', href: '/teams/companies' },
      { name: 'фонды', href: '/teams/foundations' }
    ]
  },
  { name: 'поддержать нас', href: '/support' },
  { name: 'сотрудничество', href: '/collaboration' },
  { name: 'о проекте', href: '/about' }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const getActiveSubmenu = () => {
    if (!isHydrated) return null
    for (const item of mainNavItems) {
      if (item.submenu && (pathname.startsWith(item.href))) {
        return item.submenu
      }
    }
    return null
  }

  const getActiveMainItem = () => {
    if (!isHydrated) return null
    
    // Check for section matches
    for (const item of mainNavItems) {
      if (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) {
        return item.name
      }
    }
    return null
  }

  const activeSubItems = getActiveSubmenu()
  const activeMainItem = getActiveMainItem()

  return (
    <aside className="h-screen flex sticky top-0">  {/*explanations: aside - container for the sidebar, h-screen - full height of the screen, flex - flexbox, sticky - sticky position, top-0 - stick to the top of the screen*/}
      {/* Grid 1: Main Navigation */}
      <div className="flex flex-col justify-center pl-8 md:pl-12 lg:pl-16 xl:pl-20 p-4"> {/* flexbox, flex column, center the content, p-4 - padding 4 units*/}
        <nav className="flex flex-col items-start gap-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                activeMainItem === item.name 
                  ? 'text-2xl font-medium p-2 flex items-center gap-3' 
                  : 'text-base pl-8 md:pl-12 lg:pl-16 xl:pl-20'
              }`}
            >
              {activeMainItem === item.name && (
                <Image
                  src="/Vector.svg"
                  alt="Креативное добро"
                  width={64}
                  height={64}
                />
              )}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Grid 2: Sub Navigation */}
      <div className="flex flex-col justify-center p-4">
        <nav className="flex flex-col items-start gap-2">
          {(activeSubItems || []).map((subItem) => (
            <Link
              key={subItem.name}
              href={subItem.href}
              className={`text-base ${
                pathname === subItem.href 
                  ? 'text-primary text-base' 
                  : 'text-secondary text-base'
              }`}
            >
              {subItem.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
} 