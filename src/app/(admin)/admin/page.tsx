'use client'

import { useState, useEffect, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { authManager, AuthState } from '@/lib/auth'
import { useSearchParams } from 'next/navigation'

function AdminPageContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
    expiresAt: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeView, setActiveView] = useState<string>('dashboard')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    setAuthState(authManager.getState())
    const unsubscribe = authManager.subscribe(setAuthState)
    
    const viewParam = searchParams.get('view')
    if (viewParam) {
      setActiveView(viewParam)
    } else {
      setActiveView('dashboard')
    }
    
    return unsubscribe
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const success = await authManager.login(email, password)
    if (!success) {
      alert('Неверные данные для входа')
    }
    setIsLoading(false)
  }

  if (!isHydrated) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>
  }

  if (!authState.isAuthenticated || !authManager.isTokenValid()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-100">
        <Card className="w-full max-w-md bg-white">
          <CardHeader>
            <CardTitle className="text-center">Вход в админ панель</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Добро пожаловать, {authState.user?.name}!</h1>
          <p className="text-muted-foreground">Роль: {authState.user?.role}</p>
        </div>
        <Button onClick={() => authManager.logout()} variant="outline">
          Выйти
        </Button>
      </div>

      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
              <span className="text-2xl">👤</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Зарегистрировано</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Статьи</CardTitle>
              <span className="text-2xl">📝</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Опубликовано</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Креаторы</CardTitle>
              <span className="text-2xl">🎨</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">В системе</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Команды</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Зарегистрировано</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView !== 'dashboard' && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Раздел: {activeView}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Функциональность для раздела "{activeView}" будет добавлена в следующем обновлении.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
      <AdminPageContent />
    </Suspense>
  )
}
