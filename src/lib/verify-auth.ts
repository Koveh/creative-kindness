import { NextRequest } from 'next/server'
import { verifyToken } from './auth-utils'

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export function verifyAuth(request: NextRequest): { valid: boolean; userId?: number; email?: string; role?: string } {
  const token = getAuthToken(request)
  
  if (!token) {
    return { valid: false }
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    return { valid: false }
  }
  
  return {
    valid: true,
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  }
}
