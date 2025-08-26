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

export default function OldMobileHeader() {
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

  // Hide mobile header entirely on the home page
  if (isHydrated && pathname === '/') {
    return null
  }

  return (
    <>
      {/* OLD MOBILE HEADER (preserved) - Bottom Up with rounded corners and drag handle */}
      <div className="md:hidden">
        {/* Bottom Header Bar */}
        <header className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg">
          <div className="flex items-center justify-between p-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/Vector.svg"
                alt="Креативное добро"
                width={39}
                height={36.82}
              />
              <span className="text-[16px] font-medium leading-tight text-primary">
                <span className="block">креативное</span>
                <span className="block">добро</span>
              </span>
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
          <div className="px-6 py-3 max-h-[300px] overflow-y-auto">
            {/* Drag Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Main Navigation */}
            <nav className="space-y-[4px]">
              {mainNavItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 ${
                      activeMainItem === item.name 
                        ? 'relative pl-[90px] text-[36px] font-medium leading-tight my-[9px] text-primary' 
                        : 'pl-[90px] text-[21px] whitespace-nowrap text-secondary'
                    }`}
                  >
                    {activeMainItem === item.name && (
                      <Image src="/Vector.svg" alt="стрелка" width={80} height={75} className="absolute left-0 top-1/2 -translate-y-1/2" />
                    )}
                    {item.name === 'креативное добро' ? (
                      <span className="leading-tight">
                        <span className="block">креативное</span>
                        <span className="block">добро</span>
                      </span>
                    ) : (
                      item.name
                    )}
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
    </>
  )
}

// preserved old component only
