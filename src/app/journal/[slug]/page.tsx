import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { IncrementViews } from '@/components/IncrementViews'
import { Pool } from 'pg'

interface Article {
  id: number
  title: string
  content: string
  description: string
  title_image: string
  writer: string
  publish_date: string
  company: string
  author_email: string
  author_name: string
  author_image: string
  views: number
  created_at: string
  updated_at: string
  link: string
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const client = await pool.connect()
    
    try {
      const decodedSlug = decodeURIComponent(slug)
      const normalizedSlug = slug.trim()
      const normalizedDecodedSlug = decodedSlug.trim()
      
      const result = await client.query(
        `SELECT 
          a.id, 
          a.title, 
          a.content, 
          a.description, 
          a.title_image, 
          a.writer, 
          a.publish_date, 
          a.company,
          a.author_email,
          a.views,
          a.created_at,
          a.updated_at,
          a.link,
          u.name as author_name,
          u.image as author_image
        FROM articles a
        LEFT JOIN users u ON a.author_email = u.email
        WHERE a.status = 'published' 
          AND (
            a.link = $1 
            OR a.link = $2
            OR TRIM(BOTH '/' FROM REPLACE(a.link, '/journal/', '')) = $3
            OR TRIM(BOTH '/' FROM REPLACE(a.link, '/journal/', '')) = $4
          )
        LIMIT 1`,
        [`/journal/${normalizedSlug}`, `/journal/${normalizedDecodedSlug}`, normalizedSlug, normalizedDecodedSlug]
      )
      
      if (result.rows.length === 0) {
        return null
      }
      
      const row = result.rows[0]
      return {
        id: row.id || 0,
        title: row.title || '',
        content: row.content || 'Содержание статьи скоро будет добавлено.',
        description: row.description || '',
        title_image: row.title_image || '',
        writer: row.writer || '',
        publish_date: row.publish_date || '',
        company: row.company || '',
        author_email: row.author_email || '',
        author_name: row.author_name || '',
        author_image: row.author_image || '',
        views: row.views || 0,
        created_at: row.created_at || '',
        updated_at: row.updated_at || '',
        link: row.link || ''
      }
    } finally {
      client.release()
    }
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
      <IncrementViews slug={slug} />
      {/* Full-width title image */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 mb-[50px]">
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
          <h1 className="text-[40px] md:text-[40px] lg:text-[40px] font-medium text-primary mb-4 leading-tight">
            {article.title}
          </h1>
          
          {article.description && (
            <p className="text-[24px] md:text-[24px] lg:text-[24px] text-secondary leading-relaxed mb-6">
              {article.description}
            </p>
          )}
          
          {/* Article metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-6 pb-6 border-b border-gray-200">
            {article.author_image && (
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={article.author_image}
                    alt={article.author_name || article.writer || 'Author'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {article.writer && (
              <>
                <span className="font-medium">{article.writer}</span>
                <span>•</span>
              </>
            )}
            {article.author_name && !article.writer && (
              <>
                <span className="font-medium">{article.author_name}</span>
                <span>•</span>
              </>
            )}
            {article.publish_date && (
              <span>{new Date(article.publish_date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            )}
            {article.company && (
              <>
                <span>•</span>
                <span>{article.company}</span>
              </>
            )}
            {article.views > 0 && (
              <>
                <span>•</span>
                <span>{article.views} просмотров</span>
              </>
            )}
          </div>
        </header>

        {/* Article content */}
        <div className="article-content">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-[36px] font-medium text-primary mt-12 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-[32px] font-medium text-primary mt-12 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-[28px] font-medium text-primary mt-10 mb-3">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-[24px] font-medium text-primary mt-8 mb-2">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="text-[24px] text-primary font-normal mb-6 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="text-[24px] text-primary font-normal mb-6 pl-8 list-disc space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="text-[24px] text-primary font-normal mb-6 pl-8 list-decimal space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-[24px] text-primary font-normal mb-2 leading-relaxed">{children}</li>
              ),
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[24px] text-secondary font-normal hover:text-primary transition-colors underline">{children}</a>
              ),
              strong: ({ children }) => (
                <strong className="text-[24px] text-primary font-medium">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-[24px] text-primary font-normal italic">{children}</em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="text-[24px] text-secondary font-normal mb-6 pl-6 border-l-4 border-secondary italic">{children}</blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className
                return isInline ? (
                  <code className="text-[22px] text-primary font-mono bg-gray-100 px-2 py-1 rounded">{children}</code>
                ) : (
                  <code className={className}>{children}</code>
                )
              },
              pre: ({ children }) => (
                <pre className="text-[20px] text-primary font-mono bg-gray-100 p-6 rounded-lg mb-6 overflow-x-auto">{children}</pre>
              ),
              img: ({ src, alt }) => (
                <div className="my-8">
                  <Image
                    src={src || ''}
                    alt={alt || ''}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ),
              hr: () => (
                <hr className="my-8 border-t border-gray-300" />
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