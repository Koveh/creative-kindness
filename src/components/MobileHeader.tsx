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

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const getActiveSubmenu = () => {
    if (!isHydrated) return null
    for (const item of mainNavItems) {
      if (item.submenu && pathname.startsWith(item.href)) {
        return item.submenu
      }
    }
    return null
  }

  const getActiveMainItem = () => {
    if (!isHydrated) return null
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
    <>
      {/* Mobile Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Vector.svg"
              alt="Креативное добро"
              width={32}
              height={32}
            />
            <span className="text-lg font-medium text-primary">креативное добро</span>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
              <div className={`w-5 h-0.5 bg-primary transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-primary transition-all ${isOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-primary transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`
        fixed top-0 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
          {/* Main Navigation */}
          <nav className="space-y-6">
            {mainNavItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg ${
                    activeMainItem === item.name 
                      ? 'text-primary font-medium' 
                      : 'text-secondary'
                  }`}
                >
                  {item.name}
                </Link>
                
                {/* Submenu */}
                {item.submenu && activeMainItem === item.name && (
                  <div className="mt-3 ml-4 space-y-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className={`block text-base ${
                          pathname === subItem.href 
                            ? 'text-primary' 
                            : 'text-secondary'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 