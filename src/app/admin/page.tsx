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
  const [activeView, setActiveView] = useState<'users' | 'articles' | 'add-article' | 'query' | 'stores'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    description: '',
    telegram: '',
    role: 'user'
  })
  const [articles, setArticles] = useState<Article[]>([])
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  // Stores state
  interface Store {
    id: number
    name: string
    url: string | null
    description: string | null
    city: string | null
    contact: string | null
    created_at: string
  }
  const [stores, setStores] = useState<Store[]>([])
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [newStore, setNewStore] = useState({
    name: '',
    url: '',
    description: '',
    city: '',
    contact: ''
  })
  
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

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      if (response.ok) {
        setNewUser({ name: '', email: '', password: '', phone: '', description: '', telegram: '', role: 'user' })
        fetchUsers()
        alert('Пользователь добавлен')
      } else {
        const err = await response.json().catch(() => null)
        alert(err?.error || 'Не удалось добавить пользователя')
      }
    } catch (error) {
      alert('Не удалось добавить пользователя')
    }
    setIsLoading(false)
  }

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      })
      if (response.ok) {
        setEditingUser(null)
        fetchUsers()
        alert('Данные пользователя обновлены')
      } else {
        const err = await response.json().catch(() => null)
        alert(err?.error || 'Не удалось обновить пользователя')
      }
    } catch (error) {
      alert('Не удалось обновить пользователя')
    }
    setIsLoading(false)
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

  const fetchStores = async () => {
    setIsDataLoading(true)
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const data = await response.json()
        setStores(data)
      } else {
        alert('Не удалось загрузить магазины')
      }
    } catch (error) {
      alert('Не удалось загрузить магазины')
    }
    setIsDataLoading(false)
  }

  const addStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore)
      })
      if (response.ok) {
        setNewStore({ name: '', url: '', description: '', city: '', contact: '' })
        fetchStores()
        alert('Магазин добавлен')
      } else {
        const err = await response.json().catch(() => null)
        alert(err?.error || 'Не удалось добавить магазин')
      }
    } catch (error) {
      alert('Не удалось добавить магазин')
    }
    setIsLoading(false)
  }

  const updateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStore) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/stores/${editingStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStore)
      })
      if (response.ok) {
        setEditingStore(null)
        fetchStores()
        alert('Данные магазина обновлены')
      } else {
        const err = await response.json().catch(() => null)
        alert(err?.error || 'Не удалось обновить магазин')
      }
    } catch (error) {
      alert('Не удалось обновить магазин')
    }
    setIsLoading(false)
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
        // Use the WebP URL for optimization
        setNewArticle({...newArticle, title_image: data.imageUrl})
      } else {
        const errorData = await response.json()
        alert(`Не удалось загрузить изображение: ${errorData.error}`)
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
              <Button onClick={() => { setActiveView('stores'); fetchStores(); }}>Магазины</Button>
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
              <div className="mb-6 space-y-2">
                <h3 className="text-lg font-medium">Добавить пользователя</h3>
                <form onSubmit={addUser} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="newUserName">Имя</Label>
                    <Input id="newUserName" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="newUserEmail">Email</Label>
                    <Input id="newUserEmail" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="newUserPassword">Пароль</Label>
                    <Input id="newUserPassword" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="newUserPhone">Телефон</Label>
                    <Input id="newUserPhone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="newUserTelegram">Telegram</Label>
                    <Input id="newUserTelegram" value={newUser.telegram} onChange={(e) => setNewUser({ ...newUser, telegram: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="newUserRole">Роль</Label>
                    <select id="newUserRole" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full p-2 border rounded">
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                      <option value="editor">Редактор</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="newUserDescription">Описание</Label>
                    <Input id="newUserDescription" value={newUser.description} onChange={(e) => setNewUser({ ...newUser, description: e.target.value })} />
                  </div>
                  <div className="self-end">
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Добавление...' : 'Добавить'}</Button>
                  </div>
                </form>
              </div>
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
                        <TableHead className="min-w-[120px]">Действия</TableHead>
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
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>Редактировать</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>Нет пользователей для отображения</p>
              )}

              {editingUser && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Редактировать пользователя</h3>
                  <form onSubmit={updateUser} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="editUserName">Имя</Label>
                      <Input id="editUserName" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value }) as User} required />
                    </div>
                    <div>
                      <Label htmlFor="editUserEmail">Email</Label>
                      <Input id="editUserEmail" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value }) as User} required />
                    </div>
                    <div>
                      <Label htmlFor="editUserPhone">Телефон</Label>
                      <Input id="editUserPhone" value={editingUser.phone || ''} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value }) as User} />
                    </div>
                    <div>
                      <Label htmlFor="editUserTelegram">Telegram</Label>
                      <Input id="editUserTelegram" value={editingUser.telegram || ''} onChange={(e) => setEditingUser({ ...editingUser, telegram: e.target.value }) as User} />
                    </div>
                    <div>
                      <Label htmlFor="editUserRole">Роль</Label>
                      <select id="editUserRole" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value } as User)} className="w-full p-2 border rounded">
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                        <option value="editor">Редактор</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="editUserDescription">Описание</Label>
                      <Input id="editUserDescription" value={editingUser.description || ''} onChange={(e) => setEditingUser({ ...editingUser, description: e.target.value }) as User} />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button type="submit" disabled={isLoading}>{isLoading ? 'Сохранение...' : 'Сохранить'}</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Отмена</Button>
                    </div>
                  </form>
                </div>
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

        {activeView === 'stores' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Магазины ({stores.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-2">
                <h3 className="text-lg font-medium">Добавить магазин</h3>
                <form onSubmit={addStore} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="newStoreName">Название</Label>
                    <Input id="newStoreName" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="newStoreUrl">Сайт / URL</Label>
                    <Input id="newStoreUrl" value={newStore.url} onChange={(e) => setNewStore({ ...newStore, url: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="newStoreCity">Город</Label>
                    <Input id="newStoreCity" value={newStore.city} onChange={(e) => setNewStore({ ...newStore, city: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="newStoreDescription">Описание</Label>
                    <Input id="newStoreDescription" value={newStore.description} onChange={(e) => setNewStore({ ...newStore, description: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="newStoreContact">Контакты</Label>
                    <Input id="newStoreContact" value={newStore.contact} onChange={(e) => setNewStore({ ...newStore, contact: e.target.value })} />
                  </div>
                  <div className="self-end">
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Добавление...' : 'Добавить'}</Button>
                  </div>
                </form>
              </div>

              {stores.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[60px]">ID</TableHead>
                        <TableHead className="min-w-[200px]">Название</TableHead>
                        <TableHead className="min-w-[200px]">URL</TableHead>
                        <TableHead className="min-w-[200px]">Описание</TableHead>
                        <TableHead className="min-w-[150px]">Город</TableHead>
                        <TableHead className="min-w-[180px]">Контакты</TableHead>
                        <TableHead className="min-w-[150px]">Создан</TableHead>
                        <TableHead className="min-w-[120px]">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell>{store.id}</TableCell>
                          <TableCell className="max-w-[220px] truncate">{store.name}</TableCell>
                          <TableCell className="max-w-[220px] truncate">{store.url || '-'}</TableCell>
                          <TableCell className="max-w-[220px] truncate">{store.description || '-'}</TableCell>
                          <TableCell>{store.city || '-'}</TableCell>
                          <TableCell className="max-w-[220px] truncate">{store.contact || '-'}</TableCell>
                          <TableCell>{new Date(store.created_at).toLocaleDateString('ru-RU')}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => setEditingStore(store)}>Редактировать</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>Нет магазинов для отображения</p>
              )}

              {editingStore && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Редактировать магазин</h3>
                  <form onSubmit={updateStore} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="editStoreName">Название</Label>
                      <Input id="editStoreName" value={editingStore.name} onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value } as Store)} required />
                    </div>
                    <div>
                      <Label htmlFor="editStoreUrl">Сайт / URL</Label>
                      <Input id="editStoreUrl" value={editingStore.url || ''} onChange={(e) => setEditingStore({ ...editingStore, url: e.target.value } as Store)} />
                    </div>
                    <div>
                      <Label htmlFor="editStoreCity">Город</Label>
                      <Input id="editStoreCity" value={editingStore.city || ''} onChange={(e) => setEditingStore({ ...editingStore, city: e.target.value } as Store)} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="editStoreDescription">Описание</Label>
                      <Input id="editStoreDescription" value={editingStore.description || ''} onChange={(e) => setEditingStore({ ...editingStore, description: e.target.value } as Store)} />
                    </div>
                    <div>
                      <Label htmlFor="editStoreContact">Контакты</Label>
                      <Input id="editStoreContact" value={editingStore.contact || ''} onChange={(e) => setEditingStore({ ...editingStore, contact: e.target.value } as Store)} />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button type="submit" disabled={isLoading}>{isLoading ? 'Сохранение...' : 'Сохранить'}</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingStore(null)}>Отмена</Button>
                    </div>
                  </form>
                </div>
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