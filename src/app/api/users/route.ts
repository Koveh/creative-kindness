import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT id, name, email, phone, description, telegram, role, created_at FROM users ORDER BY created_at DESC;"`

    const { stdout } = await execPromise(query)
    
    const users = stdout.trim().split('\n').filter((line: string) => line.trim()).map((line: string) => {
      const parts = line.split('|').map((part: string) => part.trim())
      return {
        id: parseInt(parts[0]),
        name: parts[1],
        email: parts[2],
        phone: parts[3] || null,
        description: parts[4] || null,
        telegram: parts[5] || null,
        role: parts[6],
        created_at: parts[7]
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}