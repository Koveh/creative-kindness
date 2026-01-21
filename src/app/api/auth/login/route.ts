import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { comparePassword, generateToken, isPasswordHashed } from '@/lib/auth-utils'

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const client = await pool.connect()
    
    try {
      const result = await client.query(
        'SELECT id, name, email, role, password FROM users WHERE email = $1 LIMIT 1',
        [email]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const user = result.rows[0]
      const storedPassword = user.password
      
      let passwordValid = false
      
      if (isPasswordHashed(storedPassword)) {
        passwordValid = await comparePassword(password, storedPassword)
      } else {
        passwordValid = password === storedPassword
      }
      
      if (!passwordValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      })

      return NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}