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
  const [activeView, setActiveView] = useState<'users' | 'articles' | 'add-article' | 'query'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Database query state
  const [queryText, setQueryText] = useState('')
  const [queryResults, setQueryResults] = useState<any[]>([])
  const [queryColumns, setQueryColumns] = useState<string[]>([])
  const [queryError, setQueryError] = useState('')
  
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
      const response = await fetch('/api/articles/admin')
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      } else {
        alert('Не удалось загрузить статьи')
      }
    } catch (error) {
      alert('Не удалось загрузить статьи')
    }
    setIsDataLoading(false)
  }

  const executeQuery = async () => {
    if (!queryText.trim()) {
      setQueryError('Введите SQL запрос')
      return
    }

    setIsDataLoading(true)
    setQueryError('')
    setQueryResults([])
    setQueryColumns([])

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        if (data.results && data.results.length > 0) {
          setQueryResults(data.results)
          setQueryColumns(Object.keys(data.results[0]))
        } else {
          setQueryResults([])
          setQueryColumns([])
        }
      } else {
        setQueryError(data.error || 'Ошибка выполнения запроса')
      }
    } catch (error) {
      setQueryError('Не удалось выполнить запрос')
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
            <div className="space-x-2 space-y-2">
              <Button onClick={() => { setActiveView('users'); fetchUsers(); }}>Пользователи</Button>
              <Button onClick={() => { setActiveView('articles'); fetchArticles(); }}>Статьи</Button>
              <Button onClick={() => setActiveView('add-article')}>Добавить статью</Button>
              <Button onClick={() => setActiveView('query')}>SQL Запросы</Button>
              <Button onClick={() => authManager.logout()} variant="outline">Выйти</Button>
            </div>
          </CardContent>
        </Card>

        {isDataLoading && <p>Загрузка...</p>}

        {activeView === 'users' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Пользователи ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[60px]">ID</TableHead>
                        <TableHead className="min-w-[150px]">Имя</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[120px]">Телефон</TableHead>
                        <TableHead className="min-w-[200px]">Описание</TableHead>
                        <TableHead className="min-w-[120px]">Telegram</TableHead>
                        <TableHead className="min-w-[100px]">Роль</TableHead>
                        <TableHead className="min-w-[150px]">Создан</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{user.email}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{user.description || '-'}</TableCell>
                          <TableCell>{user.telegram || '-'}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString('ru-RU')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>Нет пользователей для отображения</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeView === 'articles' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Статьи ({articles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {articles.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[60px]">ID</TableHead>
                        <TableHead className="min-w-[250px]">Заголовок</TableHead>
                        <TableHead className="min-w-[150px]">Автор</TableHead>
                        <TableHead className="min-w-[150px]">Компания</TableHead>
                        <TableHead className="min-w-[100px]">Статус</TableHead>
                        <TableHead className="min-w-[100px]">Просмотры</TableHead>
                        <TableHead className="min-w-[200px]">Создатель</TableHead>
                        <TableHead className="min-w-[200px]">Описание</TableHead>
                        <TableHead className="min-w-[200px]">Изображение</TableHead>
                        <TableHead className="min-w-[150px]">Дата публикации</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>{article.id}</TableCell>
                          <TableCell className="max-w-[250px] truncate">{article.title}</TableCell>
                          <TableCell>{article.writer || '-'}</TableCell>
                          <TableCell>{article.company || '-'}</TableCell>
                          <TableCell>{article.status}</TableCell>
                          <TableCell>{article.views}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{article.author_email}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{article.description || '-'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{article.title_image || '-'}</TableCell>
                          <TableCell>{article.publish_date ? new Date(article.publish_date).toLocaleDateString('ru-RU') : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>Нет статей для отображения</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeView === 'query' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>SQL Запросы к базе данных</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="query">SQL Запрос</Label>
                  <textarea
                    id="query"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    className="w-full p-2 border rounded min-h-[100px] font-mono text-sm"
                    placeholder="SELECT * FROM users LIMIT 10;"
                  />
                </div>
                <Button onClick={executeQuery} disabled={isDataLoading}>
                  {isDataLoading ? 'Выполнение...' : 'Выполнить запрос'}
                </Button>
                
                {queryError && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                    <strong>Ошибка:</strong> {queryError}
                  </div>
                )}
                
                {queryResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Результаты ({queryResults.length} строк):</h3>
                    <div className="overflow-x-auto border rounded">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            {queryColumns.map((column) => (
                              <TableHead key={column} className="min-w-[150px] bg-gray-50">
                                {column}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResults.map((row, index) => (
                            <TableRow key={index}>
                              {queryColumns.map((column) => (
                                <TableCell key={column} className="max-w-[200px] truncate">
                                  {row[column] !== null && row[column] !== undefined 
                                    ? String(row[column]) 
                                    : 'NULL'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                
                {queryResults.length === 0 && !queryError && !isDataLoading && queryText && (
                  <p>Запрос выполнен успешно, но результатов нет.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === 'add-article' && (
          <Card className="mt-4">
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