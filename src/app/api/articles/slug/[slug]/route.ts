import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -A -F '	' -c "SELECT id, title, content, description, title_image, writer, publish_date, company FROM articles WHERE link = '/journal/${slug}' AND status = 'published' LIMIT 1;"`

    const { stdout } = await execPromise(query)
    
    if (!stdout.trim()) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const line = stdout.trim()
    const parts = line.split('\t')
    
    console.log('Database response parts:', parts.length, 'Content preview:', parts[2]?.substring(0, 100))
    
    const article = {
      id: parseInt(parts[0]?.trim() || '0'),
      title: parts[1]?.trim() || '',
      content: parts[2]?.trim() || 'Содержание статьи скоро будет добавлено.',
      description: parts[3]?.trim() || '',
      title_image: parts[4]?.trim().replace(/\$+$/, '') || '',
      writer: parts[5]?.trim() || '',
      publish_date: parts[6]?.trim() || '',
      company: parts[7]?.trim().replace(/\$+$/, '') || ''
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}