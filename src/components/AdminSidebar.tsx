'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'

interface MenuItem {
  name: string
  href: string
  icon: string
  description?: string
}

const adminNavItems: MenuItem[] = [
  { 
    name: 'дашборд', 
    href: '/admin', 
    icon: '📊',
    description: 'Обзор системы'
  },
  { 
    name: 'пользователи', 
    href: '/admin?view=users', 
    icon: '👥',
    description: 'Управление пользователями'
  },
  { 
    name: 'статьи', 
    href: '/admin?view=articles', 
    icon: '📝',
    description: 'Просмотр статей'
  },
  { 
    name: 'добавить статью', 
    href: '/admin?view=add-article', 
    icon: '➕',
    description: 'Создание новой статьи'
  },
  { 
    name: 'креаторы', 
    href: '/admin?view=creators', 
    icon: '🎨',
    description: 'Управление креаторами'
  },
  { 
    name: 'команды', 
    href: '/admin?view=teams', 
    icon: '👥',
    description: 'Управление командами'
  },
  { 
    name: 'главная страница', 
    href: '/admin?view=main-page', 
    icon: '🏠',
    description: 'Настройки главной'
  },
  { 
    name: 'магазины', 
    href: '/admin?view=stores', 
    icon: '🏪',
    description: 'Управление магазинами'
  },
  { 
    name: 'sql запросы', 
    href: '/admin?view=query', 
    icon: '🔍',
    description: 'Прямые запросы к БД'
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const getActiveView = () => {
    if (!isHydrated) return null
    return searchParams.get('view')
  }

  const isActive = (item: MenuItem) => {
    if (item.href === '/admin' && pathname === '/admin' && !getActiveView()) {
      return true
    }
    if (item.href.includes('?view=')) {
      const viewParam = item.href.split('?view=')[1]
      return getActiveView() === viewParam
    }
    return false
  }

  return (
    <aside className="h-screen flex sticky top-0 bg-white border-r border-border">
      {/* Grid 1: Main Navigation */}
      <div className="flex flex-col justify-center pl-0 p-4">
        <nav className="flex flex-col items-start gap-[10px]">
          {/* Admin Panel Title */}
          <div className="relative block pl-[103px] text-[24px] mb-8">
            <Image
              src="/Vector.svg"
              alt="Креативное добро"
              width={93}
              height={88}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            />
            <span className="leading-tight">
              <span className="block">админ</span>
              <span className="block">панель</span>
            </span>
          </div>

          {/* Navigation Items */}
          {adminNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative block pl-[103px] transition-all duration-200 ${
                isActive(item) 
                  ? 'text-[32px] my-[10px] text-primary'
                  : 'text-[20px] text-muted-foreground hover:text-primary'
              }`}
            >
              {isActive(item) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[93px] h-[88px] bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{item.icon}</span>
                </div>
              )}
              <span className="leading-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Grid 2: Sub Navigation - Show active item description */}
      <div className="flex flex-col justify-center p-4">
        <nav className="flex flex-col items-start gap-2 text-[16px]">
          {(() => {
            const activeItem = adminNavItems.find(item => isActive(item))
            if (activeItem && activeItem.description) {
              return (
                <div className="max-w-xs">
                  <div className="text-primary font-medium leading-tight mb-1">
                    {activeItem.name}
                  </div>
                  <div className="text-muted-foreground leading-tight">
                    {activeItem.description}
                  </div>
                </div>
              )
            }
            return (
              <div className="max-w-xs">
                <div className="text-muted-foreground leading-tight">
                  Выберите раздел для управления
                </div>
              </div>
            )
          })()}
        </nav>
      </div>
    </aside>
  )
}
