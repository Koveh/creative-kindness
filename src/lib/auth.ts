interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  expiresAt: number | null
}

const AUTH_STORAGE_KEY = 'auth_state'
const HALF_YEAR_MS = 6 * 30 * 24 * 60 * 60 * 1000 // 6 months in milliseconds

class AuthManager {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null,
    expiresAt: null
  }

  private listeners: Array<(state: AuthState) => void> = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsedState = JSON.parse(stored)
        if (parsedState.expiresAt && Date.now() < parsedState.expiresAt) {
          this.state = parsedState
        } else {
          this.clearAuth()
        }
      } catch {
        this.clearAuth()
      }
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.state))
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state))
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  getState() {
    return this.state
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const { user, token } = await response.json()
        
        this.state = {
          user,
          isAuthenticated: true,
          token,
          expiresAt: Date.now() + HALF_YEAR_MS
        }

        this.saveToStorage()
        this.notify()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  logout() {
    this.clearAuth()
    this.notify()
  }

  private clearAuth() {
    this.state = {
      user: null,
      isAuthenticated: false,
      token: null,
      expiresAt: null
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  isTokenValid(): boolean {
    return this.state.expiresAt ? Date.now() < this.state.expiresAt : false
  }
}

export const authManager = new AuthManager()
export type { User, AuthState }