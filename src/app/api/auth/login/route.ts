import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT id, name, email, role FROM users WHERE email = '${email}' AND password = '${password}' LIMIT 1;"`

    const { stdout } = await execPromise(query)
    
    if (!stdout.trim()) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const line = stdout.trim()
    const parts = line.split('|').map((part: string) => part.trim())
    
    const user = {
      id: parseInt(parts[0]),
      name: parts[1],
      email: parts[2],
      role: parts[3]
    }

    return NextResponse.json({ 
      success: true, 
      user,
      token: 'temp-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}