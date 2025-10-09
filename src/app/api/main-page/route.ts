import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT title, description, image FROM main_page_content LIMIT 1;"`

    const { stdout } = await execPromise(query)
    
    const lines = stdout.trim().split('\n').filter((line: string) => line.trim())
    
    if (lines.length === 0) {
      return NextResponse.json({
        title: 'Креативное добро',
        description: 'Медиа-платформа нового поколения',
        image: '/main.png'
      })
    }

    const line = lines[0]
    const parts = line.split('|').map((part: string) => part.trim())
    
    return NextResponse.json({
      title: parts[0] || 'Креативное добро',
      description: parts[1] || 'Медиа-платформа нового поколения',
      image: parts[2] || '/main.png'
    })
  } catch (error) {
    console.error('Error fetching main page content:', error)
    return NextResponse.json({
      title: 'Креативное добро',
      description: 'Медиа-платформа нового поколения',
      image: '/main.png'
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    // First, try to update existing record
    let query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -c "UPDATE main_page_content SET title = '${data.title.replace(/'/g, "''")}', description = '${data.description.replace(/'/g, "''")}', image = '${data.image}', updated_at = CURRENT_TIMESTAMP WHERE id = 1;"`

    try {
      await execPromise(query)
    } catch (error) {
      // If update fails, create new record
      query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -c "INSERT INTO main_page_content (title, description, image) VALUES ('${data.title.replace(/'/g, "''")}', '${data.description.replace(/'/g, "''")}', '${data.image}');"`
      await execPromise(query)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating main page content:', error)
    return NextResponse.json({ error: 'Failed to update main page content' }, { status: 500 })
  }
}
