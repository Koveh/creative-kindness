import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface Article {
  id: number
  title: string
  content: string
  description: string
  title_image: string
  writer: string
  publish_date: string
  company: string
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Use the current request's host for server-side fetching
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = process.env.URL || 'localhost:3004'
    const baseUrl = `${protocol}://${host}`
    
    const response = await fetch(`${baseUrl}/api/articles/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return null
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="w-full">
      {/* Full-width title image */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 mb-4 sm:mb-6 md:mb-8">
      {/* <div className="relative w-full h-64 md:h-80 lg:h-96 mb-12 -mx-4 md:-mx-6 -mt-4 md:-mt-6"> */}
        <Image
          src={article.title_image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <article className="w-full">

      {/* Article content with max-w-2xl */}
      <div className="max-w-2xl mx-auto">
        {/* Article header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-2xl lg:text-4xl font-medium text-primary mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-base lg:text-lg text-secondary leading-relaxed mb-4">
            {article.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-secondary">
            <span>{article.writer}</span>
            <span>•</span>
            <span>{new Date(article.publish_date).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            {article.company && (
              <>
                <span>•</span>
                <span>{article.company}</span>
              </>
            )}
          </div>
        </header>

        {/* Article content */}
        <div className="article-content">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-medium text-primary mt-12 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-medium text-primary mt-8 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-base text-primary font-normal mb-4 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="text-base text-primary font-normal mb-4 pl-6 list-disc">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-base text-primary font-normal mb-1">{children}</li>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-base text-secondary font-normal hover:text-primary transition-colors">{children}</a>
              ),
              strong: ({ children }) => (
                <strong className="text-base text-primary font-medium">{children}</strong>
              )
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Back to journal link */}
        <div className="mt-12 pt-8">
          <Link 
            href="/journal" 
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <span>←</span>
            <span>Вернуться к журналу</span>
          </Link>
        </div>
      </div>
      </article>
    </div>
  )
}