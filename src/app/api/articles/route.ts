import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const offset = (page - 1) * limit

    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT id, title, author_email, writer, company, status, views, publish_date, description, title_image, link FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};"`

    const countQuery = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT COUNT(*) FROM articles WHERE status = 'published';"`

    const [{ stdout }, { stdout: countStdout }] = await Promise.all([
      execPromise(query),
      execPromise(countQuery)
    ])
    
    const articles = stdout.trim().split('\n').filter((line: string) => line.trim()).map((line: string) => {
      const parts = line.split('|').map((part: string) => part.trim())
      return {
        id: parseInt(parts[0]),
        title: parts[1],
        author_email: parts[2],
        writer: parts[3] || null,
        company: parts[4] || null,
        status: parts[5],
        views: parseInt(parts[6]) || 0,
        publish_date: parts[7] || null,
        description: parts[8] || null,
        title_image: parts[9] || null,
        link: parts[10] || null
      }
    })

    const totalCount = parseInt(countStdout.trim())
    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -c "INSERT INTO articles (title, content, author_email, writer, company, status, description, title_image, publish_date) VALUES ('${data.title.replace(/'/g, "''")}', '${data.content.replace(/'/g, "''")}', '${data.author_email}', '${data.writer || ''}', '${data.company || ''}', '${data.status}', '${data.description.replace(/'/g, "''")}', '${data.title_image || ''}', ${data.status === 'published' ? 'CURRENT_TIMESTAMP' : 'NULL'});"`

    await execPromise(query)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}