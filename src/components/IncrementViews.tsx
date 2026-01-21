'use client'

import { useEffect, useRef } from 'react'

interface IncrementViewsProps {
  slug: string
}

export function IncrementViews({ slug }: IncrementViewsProps) {
  const hasIncremented = useRef(false)

  useEffect(() => {
    if (hasIncremented.current) return
    
    const storageKey = `article_viewed_${slug}`
    const hasViewed = typeof window !== 'undefined' && sessionStorage.getItem(storageKey)
    
    if (hasViewed) return
    
    hasIncremented.current = true
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, 'true')
    }

    fetch(`/api/articles/slug/${slug}/increment-views`, {
      method: 'POST',
    }).catch((error) => {
      console.error('Failed to increment views:', error)
    })
  }, [slug])

  return null
}
