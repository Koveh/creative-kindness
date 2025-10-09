import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT id, name, role, image, description, link, slug, category FROM creators WHERE category = '${params.category}' ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};"`

    const countQuery = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT COUNT(*) FROM creators WHERE category = '${params.category}';"`

    const [{ stdout }, { stdout: countStdout }] = await Promise.all([
      execPromise(query),
      execPromise(countQuery)
    ])
    
    const creators = stdout.trim().split('\n').filter((line: string) => line.trim()).map((line: string) => {
      const parts = line.split('|').map((part: string) => part.trim())
      
      if (parts.length < 8) {
        console.warn('Incomplete creator data:', line)
        return null
      }
      
      return {
        id: parseInt(parts[0]) || 0,
        name: parts[1] || '',
        role: parts[2] || '',
        image: parts[3] === '' || parts[3] === 'NULL' ? null : parts[3],
        description: parts[4] === '' || parts[4] === 'NULL' ? null : parts[4],
        link: parts[5] === '' || parts[5] === 'NULL' ? null : parts[5],
        slug: parts[6] || '',
        category: parts[7] || 'marketing'
      }
    }).filter((creator: any) => creator !== null)

    const totalCount = parseInt(countStdout.trim())
    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      creators,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      }
    })
  } catch (error) {
    console.error('Error fetching creators by category:', error)
    return NextResponse.json({ error: 'Failed to fetch creators' }, { status: 500 })
  }
}
