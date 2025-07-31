import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Simple database query using the same connection
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT id, name, email, role FROM users WHERE email = '${email}' AND password = '${password}' AND role = 'admin';"`

    const { stdout } = await execPromise(query)
    
    if (stdout.trim()) {
      const parts = stdout.trim().split('|').map(part => part.trim())
      const user = {
        id: parseInt(parts[0]),
        name: parts[1],
        email: parts[2],
        role: parts[3]
      }

      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

      return NextResponse.json({ user, token })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}