import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT id, name, role, image, description, link, slug, category FROM creators WHERE slug = '${params.slug}' LIMIT 1;"`

    const { stdout } = await execPromise(query)
    
    const lines = stdout.trim().split('\n').filter((line: string) => line.trim())
    
    if (lines.length === 0) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    const line = lines[0]
    const parts = line.split('|').map((part: string) => part.trim())
    
    if (parts.length < 8) {
      return NextResponse.json({ error: 'Invalid creator data' }, { status: 500 })
    }
    
    const creator = {
      id: parseInt(parts[0]) || 0,
      name: parts[1] || '',
      role: parts[2] || '',
      image: parts[3] === '' || parts[3] === 'NULL' ? null : parts[3],
      description: parts[4] === '' || parts[4] === 'NULL' ? null : parts[4],
      link: parts[5] === '' || parts[5] === 'NULL' ? null : parts[5],
      slug: parts[6] || '',
      category: parts[7] || 'marketing'
    }

    return NextResponse.json({ creator })
  } catch (error) {
    console.error('Error fetching creator:', error)
    return NextResponse.json({ error: 'Failed to fetch creator' }, { status: 500 })
  }
}
