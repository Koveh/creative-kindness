'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface SubMenuItem {
  name: string
  href: string
  description?: string
}

interface MenuItem {
  name: string
  href: string
  submenu?: SubMenuItem[]
}

interface Article {
  id: number
  title: string
  slug: string
  description?: string
  content?: string
}

interface Heading {
  level: number
  text: string
  id: string
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

// Helper function to extract headings from markdown content
const extractHeadings = (content: string): Heading[] => {
  if (!content) return []
  
  // Clean the content first - remove extra formatting characters
  const cleanContent = content
    .replace(/\+\s*\n/g, '\n') // Remove trailing + characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  // Simple and reliable regex for markdown headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Heading[] = []
  
  let match
  while ((match = headingRegex.exec(cleanContent)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    
    headings.push({ level, text, id })
  }
  
  return headings
}

// Helper function to truncate text with fade effect
const truncateWithFade = (text: string, maxLines: number = 2, fadeChars: number = 3) => {
  if (!text) return ''
  
  // Split into lines (roughly 50 characters per line for estimation)
  const charsPerLine = 50
  const maxChars = maxLines * charsPerLine
  
  if (text.length <= maxChars) return text
  
  // Truncate to max characters minus fade characters
  const truncated = text.substring(0, maxChars - fadeChars)
  
  return (
    <span className="relative inline-block">
      {truncated}
      <span 
        className="absolute right-0 top-0 bottom-0 w-4 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, var(--background) 0%, var(--background) 50%, transparent 100%)'
        }}
      ></span>
    </span>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isHydrated, setIsHydrated] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Fetch articles when on journal pages
  useEffect(() => {
    if (pathname.startsWith('/journal')) {
      fetchArticles()
    }
  }, [pathname])

  // Extract headings when current article changes
  useEffect(() => {
    if (currentArticle?.content) {
      console.log('Current article content length:', currentArticle.content.length)
      console.log('Current article title:', currentArticle.title)
      console.log('Content preview:', currentArticle.content.substring(0, 500))
      const extractedHeadings = extractHeadings(currentArticle.content)
      console.log('Extracted headings:', extractedHeadings)
      setHeadings(extractedHeadings)
    } else {
      console.log('No article content available')
      setHeadings([])
    }
  }, [currentArticle])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched articles data:', data)
        setArticles(data.articles || data)
        
        // If we're on a specific article page, find the current article
        if (pathname.startsWith('/journal/') && pathname !== '/journal') {
          const slug = pathname.split('/journal/')[1]
          console.log('Looking for article with slug:', slug)
          const article = (data.articles || data).find((a: Article) => a.slug === slug)
          console.log('Found article:', article)
          setCurrentArticle(article || null)
        }
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    }
  }

  const getActiveSubmenu = () => {
    if (!isHydrated) return null
    
    // If we're on a journal article page, show the current article title and headings
    if (pathname.startsWith('/journal/') && pathname !== '/journal' && currentArticle) {
      const submenuItems: SubMenuItem[] = []
      
      // Add article title as first item
      submenuItems.push({
        name: currentArticle.title,
        href: pathname,
        description: currentArticle.description
      })
      
      // Add headings from content
      headings.forEach((heading) => {
        submenuItems.push({
          name: heading.text,
          href: `${pathname}#${heading.id}`,
          description: `H${heading.level}`
        })
      })
      
      return submenuItems
    }
    
    // Check for other submenus
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
      <div className="flex flex-col justify-center pl-0 p-4"> {/* flexbox, flex column, center the content, p-4 - padding 4 units*/}
        <nav className="flex flex-col items-start gap-[10px]">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative block pl-[103px] ${
                activeMainItem === item.name 
                  ? 'text-[41px] my-[10px]'
                  : 'text-[24px]'
              }`}
            >
              {activeMainItem === item.name && (
                <Image
                  src="/Vector.svg"
                  alt="Креативное добро"
                  width={93}
                  height={88}
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                />
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
          ))}
        </nav>
      </div>

      {/* Grid 2: Sub Navigation */}
      <div className="flex flex-col justify-center p-4">
        <nav className="flex flex-col items-start gap-2 text-[20px]">
          {(activeSubItems || []).map((subItem, index) => (
            <div key={`${subItem.name}-${index}`} className="max-w-xs">
              <Link
                href={subItem.href}
                className={`block ${
                  pathname === subItem.href 
                    ? 'text-primary' 
                    : 'text-secondary'
                }`}
              >
                <div className="font-normal leading-tight mb-1">
                  {truncateWithFade(subItem.name, 2, 3)}
                </div>
                {subItem.description && (
                  <div className={`text-xs leading-tight ${
                    subItem.description.startsWith('H') 
                      ? 'text-muted-foreground font-mono' 
                      : 'text-secondary'
                  }`}>
                    {subItem.description.startsWith('H') 
                      ? subItem.description 
                      : truncateWithFade(subItem.description, 2, 3)
                    }
                  </div>
                )}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
} 