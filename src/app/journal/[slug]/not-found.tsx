import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h1 className="text-3xl font-medium text-primary mb-4">
        Статья не найдена
      </h1>
      <p className="text-secondary mb-8">
        К сожалению, запрашиваемая статья не существует или была удалена.
      </p>
      <Link 
        href="/journal" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-none hover:bg-secondary transition-colors"
      >
        <span>←</span>
        <span>Вернуться к журналу</span>
      </Link>
    </div>
  )
}