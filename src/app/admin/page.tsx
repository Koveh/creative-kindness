'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { authManager, AuthState } from '@/lib/auth'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  description: string | null
  telegram: string | null
  role: string
  created_at: string
}

interface Article {
  id: number
  title: string
  author_email: string
  writer: string | null
  company: string | null
  status: string
  views: number
  publish_date: string | null
  description: string | null
  title_image: string | null
}

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
    expiresAt: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeView, setActiveView] = useState<'users' | 'articles' | 'add-article'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Add article form state
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    writer: '',
    company: '',
    status: 'draft',
    description: '',
    title_image: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    setAuthState(authManager.getState())
    const unsubscribe = authManager.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const fetchUsers = async () => {
    setIsDataLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      alert('Не удалось загрузить пользователей')
    }
    setIsDataLoading(false)
  }

  const fetchArticles = async () => {
    setIsDataLoading(true)
    try {
      const response = await fetch('/api/articles')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      alert('Не удалось загрузить статьи')
    }
    setIsDataLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const success = await authManager.login(email, password)
    
    if (!success) {
      alert('Неверные данные для входа')
    }
    
    setIsLoading(false)
  }

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newArticle,
          author_email: authState.user?.email
        })
      })
      
      if (response.ok) {
        setNewArticle({
          title: '',
          content: '',
          writer: '',
          company: '',
          status: 'draft',
          description: '',
          title_image: ''
        })
        alert('Статья успешно добавлена')
        if (activeView === 'articles') {
          fetchArticles()
        }
      } else {
        alert('Не удалось добавить статью')
      }
    } catch (error) {
      alert('Не удалось добавить статью')
    }
    
    setIsLoading(false)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setNewArticle({...newArticle, title_image: data.imageUrl})
      } else {
        alert('Не удалось загрузить изображение')
      }
    } catch (error) {
      alert('Ошибка при загрузке изображения')
    }
    
    setUploadingImage(false)
  }

  if (!isHydrated) {
    return <div>Загрузка...</div>
  }

  if (authState.isAuthenticated && authManager.isTokenValid()) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Панель администратора</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Добро пожаловать, {authState.user?.name}!</p>
            <p>Роль: {authState.user?.role}</p>
            <div>
              <Button onClick={() => { setActiveView('users'); fetchUsers(); }}>Пользователи</Button>
              <Button onClick={() => { setActiveView('articles'); fetchArticles(); }}>Статьи</Button>
              <Button onClick={() => setActiveView('add-article')}>Добавить статью</Button>
              <Button onClick={() => authManager.logout()}>Выйти</Button>
            </div>
          </CardContent>
        </Card>

        {isDataLoading && <p>Загрузка...</p>}

        {activeView === 'users' && users.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Пользователи</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Telegram</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Создан</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>{user.telegram || '-'}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeView === 'articles' && articles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Статьи</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Заголовок</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Компания</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Просмотры</TableHead>
                    <TableHead>Создатель</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>{article.id}</TableCell>
                      <TableCell>{article.title}</TableCell>
                      <TableCell>{article.writer || '-'}</TableCell>
                      <TableCell>{article.company || '-'}</TableCell>
                      <TableCell>{article.status}</TableCell>
                      <TableCell>{article.views}</TableCell>
                      <TableCell>{article.author_email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeView === 'add-article' && (
          <Card>
            <CardHeader>
              <CardTitle>Добавить новую статью</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddArticle}>
                <div>
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Input
                    id="description"
                    value={newArticle.description}
                    onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Содержание (Markdown)</Label>
                  <textarea
                    id="content"
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    rows={10}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="writer">Автор</Label>
                  <Input
                    id="writer"
                    value={newArticle.writer}
                    onChange={(e) => setNewArticle({...newArticle, writer: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Компания</Label>
                  <Input
                    id="company"
                    value={newArticle.company}
                    onChange={(e) => setNewArticle({...newArticle, company: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="title_image">Изображение заголовка</Label>
                  <Input
                    id="title_image"
                    placeholder="URL изображения"
                    value={newArticle.title_image}
                    onChange={(e) => setNewArticle({...newArticle, title_image: e.target.value})}
                  />
                  <div>
                    <Label htmlFor="image_upload">Или загрузить файл:</Label>
                    <input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <span>Загрузка...</span>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <select
                    id="status"
                    value={newArticle.status}
                    onChange={(e) => setNewArticle({...newArticle, status: e.target.value})}
                  >
                    <option value="draft">Черновик</option>
                    <option value="review">На рецензии</option>
                    <option value="published">Опубликовано</option>
                  </select>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Добавление...' : 'Добавить статью'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Вход в панель администратора</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}