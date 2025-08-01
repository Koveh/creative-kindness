'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import ArticleSkeleton from '@/components/ArticleSkeleton'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Article {
  id: number
  title: string
  description: string
  title_image: string
  link: string
  writer: string
  publish_date: string
}

interface ApiResponse {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasMore: boolean
  }
}

export default function JournalPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const fetchArticles = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    setLoading(true)
    console.log(`Fetching articles: page ${pageNum}, append: ${append}`)
    try {
      const response = await fetch(`/api/articles?page=${pageNum}&limit=5`)
      const data: ApiResponse = await response.json()
      console.log(`Received ${data.articles.length} articles, hasMore: ${data.pagination.hasMore}`)
      
      if (append) {
        setArticles(prev => {
          const existingIds = new Set(prev.map(article => article.id))
          const newArticles = data.articles.filter(article => !existingIds.has(article.id))
          console.log(`Adding ${newArticles.length} new articles to existing ${prev.length}`)
          return [...prev, ...newArticles]
        })
      } else {
        setArticles(data.articles)
        setInitialLoading(false)
      }
      
      setHasMore(data.pagination.hasMore)
    } catch (error) {
      console.error('Failed to fetch articles:', error)
      setInitialLoading(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles(1, false)
  }, [fetchArticles])

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return

      const scrollPosition = window.innerHeight + window.scrollY
      const threshold = document.documentElement.offsetHeight - 1000

      if (scrollPosition >= threshold) {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchArticles(nextPage, true)
      }
    }

    const throttledHandleScroll = throttle(handleScroll, 200)
    window.addEventListener('scroll', throttledHandleScroll)
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [loading, hasMore, currentPage, fetchArticles])

  // Throttle function to limit how often scroll handler runs
  function throttle(func: Function, limit: number) {
    let inThrottle: boolean
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  if (initialLoading) {
    return (
      <div className="w-full">
        <div className="space-y-16">
          {Array.from({ length: 5 }).map((_, index) => (
            <ArticleSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="space-y-16">
        {articles.map((article, index) => (
          <article key={`article-${article.id}-${index}`} className="group">
            <Link href={article.link || '#'} className="block">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Article Content - Left Side (1/3) */}
                <div className="lg:w-1/3 space-y-4">
                  
                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-medium text-primary group-hover:text-secondary transition-colors leading-tight">
                    {article.title}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-secondary leading-relaxed">
                    {article.description}
                  </p>
                  
                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-primary group-hover:text-secondary transition-colors">
                    <span className="font-medium">читать</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
                
                {/* Article Image - Right Side (2/3) */}
                <div className="lg:w-2/3">
                  <div className="relative w-full h-64 lg:h-80 overflow-hidden rounded-none">
                    {article.title_image ? (
                      <Image
                        src={article.title_image}
                        alt={article.title || 'Article image'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Нет изображения</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
        
        {loading && !initialLoading && (
          <div className="py-12">
            <LoadingSpinner size="lg" />
            <p className="text-center text-secondary mt-4">Загружаем еще статьи...</p>
          </div>
        )}
        
        {!hasMore && articles.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-secondary font-medium">Все статьи загружены</span>
            </div>
          </div>
        )}
        
        {articles.length === 0 && !initialLoading && !loading && (
          <div className="text-center py-12">
            <p className="text-secondary">Статьи не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}