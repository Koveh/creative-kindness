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
      {/* NEW MOBILE HEADER - Bottom Up */}
      <div className="md:hidden">
        {/* Bottom Header Bar */}
        <header className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/Vector.svg"
                alt="Креативное добро"
                width={24}
                height={24}
              />
              <span className="text-sm font-medium text-primary">креативное добро</span>
            </div>

            {/* Menu Toggle Button */}
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

        {/* Bottom Navigation Drawer */}
        <div className={`
          fixed bottom-0 left-0 w-full bg-white z-40 transform transition-transform duration-300 ease-in-out rounded-t-2xl shadow-2xl
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `} style={{ maxHeight: '300px' }}>
          <div className="px-6 py-4 max-h-[300px] overflow-y-auto">
            {/* Drag Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Main Navigation */}
            <nav className="space-y-4">
              {mainNavItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-base py-2 ${
                      activeMainItem === item.name 
                        ? 'text-primary font-medium' 
                        : 'text-secondary'
                    }`}
                  >
                    {item.name}
                  </Link>
                  
                  {/* Submenu */}
                  {item.submenu && activeMainItem === item.name && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className={`block text-sm py-1 ${
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


      </div>

      {/* COMMENTED OUT OLD MOBILE HEADER */}
      {/*
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/Vector.svg"
              alt="Креативное добро"
              width={32}
              height={32}
            />
            <span className="text-lg font-medium text-primary">креативное добро</span>
          </div>

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

      <div className={`
        fixed top-0 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
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

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      */}
    </>
  )
} 