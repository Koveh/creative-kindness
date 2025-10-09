# Креативное добро

Медиа-платформа нового поколения, объединяющая благотворительные фонды и креаторов для создания социально значимого контента.

## 🚀 Последние обновления

### База данных для креаторов и команд
- ✅ **Новые таблицы**: Созданы таблицы `creators` и `teams` в PostgreSQL
- ✅ **Категоризация**: Добавлены категории для креаторов (marketing, photo-video, studios) и команд (studios, foundations, companies)
- ✅ **API endpoints**: Добавлены REST API для работы с креаторами и командами, включая фильтрацию по категориям
- ✅ **Динамические страницы**: Страницы креаторов и команд теперь загружают данные из БД
- ✅ **Slug-маршрутизация**: Поддержка SEO-friendly URL для каждого креатора и команды
- ✅ **Перенаправления**: Главные страницы /creators и /teams перенаправляют на категории по умолчанию
- ✅ **Активные состояния**: В сайдбаре активные категории отображаются черным шрифтом

### Страница поддержки
- ✅ **Новый дизайн**: Обновлена страница поддержки в соответствии с макетами
- ✅ **Hero изображение**: Добавлено главное изображение support_us.webp (как на странице about)
- ✅ **Форма пожертвований**: Улучшенная форма с предзаполненными полями и правильным расположением
- ✅ **WebP оптимизация**: Все изображения конвертированы в WebP формат

### Страница сотрудничества
- ✅ **Новая страница**: Создана отдельная страница /collaboration для секции сотрудничества
- ✅ **3 карточки сотрудничества**: Благотворительность, Креатор, Бизнес с соответствующими изображениями
- ✅ **Централизованное расположение**: Элементы размещены по центру как в макете
- ✅ **Мобильная оптимизация**: Исправлены отступы между статьями на мобильных устройствах

### Изображения и оптимизация
- ✅ **WebP конвертация**: Все загружаемые изображения автоматически конвертируются в WebP формат для оптимизации
- ✅ **Двойное хранение**: Изображения сохраняются в оригинальном формате и WebP версии
- ✅ **Оптимизированная доставка**: Фронтенд получает только WebP версии для быстрой загрузки
- ✅ **MinIO интеграция**: Надежное хранение файлов в объектном хранилище

### Адаптивный дизайн
- ✅ **Мобильная оптимизация**: Исправлены проблемы с отступами на маленьких экранах
- ✅ **Отзывчивая навигация**: Боковая панель корректно работает на всех устройствах
- ✅ **Улучшенная типографика**: Оптимизированные размеры шрифтов для разных экранов

### Навигация и UX
- ✅ **Контекстная навигация**: В боковой панели отображаются заголовки статей при просмотре
- ✅ **Извлечение заголовков**: Автоматическое извлечение H1-H6 заголовков из markdown контента
- ✅ **Навигация по разделам**: Прямые ссылки на разделы статьи через якорные ссылки
- ✅ **Улучшенная структура**: Четкое разделение между основным и подменю
- ✅ **Активные состояния**: Визуальная индикация текущей страницы
- ✅ **Ограничение текста**: Заголовки ограничены 2 строками с эффектом затухания

## 📊 Техническая архитектура

### Схема взаимодействия компонентов

```mermaid
graph TD
    A[Пользователь] --> B[Страница поддержки]
    A --> C[Страница сотрудничества]
    A --> D[Страница креаторов]
    A --> E[Страница команд]
    
    B --> F[Hero изображение]
    B --> G[Форма пожертвований]
    
    C --> H[Секция сотрудничества]
    H --> I[3 карточки: Благотворительность, Креатор, Бизнес]
    
    D --> J[API /api/creators]
    E --> K[API /api/teams]
    
    J --> L[PostgreSQL: creators]
    K --> M[PostgreSQL: teams]
    
    D --> N[Страница креатора /creators/[slug]]
    E --> O[Страница команды /teams/[slug]]
    
    N --> P[API /api/creators/[slug]]
    O --> Q[API /api/teams/[slug]]
    
    F --> R[MinIO: support_us.webp]
    I --> S[MinIO: coop.webp]
    I --> T[MinIO: coop_1.webp]
    I --> U[MinIO: coop_2.webp]
    
    G --> V[API обработка]
    V --> W[PostgreSQL: users]
    V --> X[PostgreSQL: donations]
    
    R --> Y[WebP оптимизация]
    S --> Y
    T --> Y
    U --> Y
    
    Y --> Z[CDN доставка]
    Z --> AA[Быстрая загрузка]
```

### База данных PostgreSQL

**База данных**: `creative_kindness` (создана отдельно от основной БД koveh)

**Таблицы**:
- `users` - 4 записи (пользователи системы)
- `articles` - 13 записей (статьи с контентом)
- `creators` - 6 записей (креаторы и их профили)
- `teams` - 6 записей (команды и организации)
- `main_page_content` - 1 запись (контент главной страницы)

**Структура таблиц**:

```sql
-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    telegram VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(500)
);

-- Таблица креаторов
CREATE TABLE creators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    image VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица команд
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    image VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статей
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    author_email VARCHAR(255) NOT NULL,
    writer VARCHAR(255),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    publish_date TIMESTAMP,
    description TEXT,
    title_image VARCHAR(500),
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица креаторов
CREATE TABLE creators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    image VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица команд
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    image VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица контента главной страницы
CREATE TABLE main_page_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

**Креаторы**:
- `GET /api/creators` - Получить список всех креаторов с пагинацией
- `GET /api/creators/[slug]` - Получить конкретного креатора по slug
- `POST /api/creators` - Создать нового креатора

**Команды**:
- `GET /api/teams` - Получить список всех команд с пагинацией
- `GET /api/teams/[slug]` - Получить конкретную команду по slug
- `POST /api/teams` - Создать новую команду

**Главная страница**:
- `GET /api/main-page` - Получить контент главной страницы
- `PUT /api/main-page` - Обновить контент главной страницы

**Параметры запросов**:
- `page` - Номер страницы (по умолчанию 1)
- `limit` - Количество записей на странице (по умолчанию 10)

**Примеры ответов**:

```json
// GET /api/creators
{
  "creators": [
    {
      "id": 1,
      "name": "Федор Шубочкин",
      "role": "Креативное Добро",
      "image": "http://65.109.88.77:9000/creative-kindness/Fedor_Shubochkin.jpg",
      "description": "Писатель, редактор, креативный директор...",
      "link": "#",
      "slug": "федор-шубочкин"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 6,
    "totalPages": 1,
    "hasMore": false
  }
}

// GET /api/creators/федор-шубочкин
{
  "creator": {
    "id": 1,
    "name": "Федор Шубочкин",
    "role": "Креативное Добро",
    "image": "http://65.109.88.77:9000/creative-kindness/Fedor_Shubochkin.jpg",
    "description": "Писатель, редактор, креативный директор...",
    "link": "#",
    "slug": "федор-шубочкин"
  }
}
```

**Подключение**: Настроено в `.env` файле с отдельной БД для проекта

### MinIO

Создайте bucket для изображений:

```bash
mc mb your-minio/creative-kindness
mc anonymous set public your-minio/creative-kindness
```

## 👥 Администраторы по умолчанию

- **Даниил Ковех**: daniil@koveh.com
- **Федор Шубочкин**: doc.shuba@yandex.ru

## 📝 Функции

### Панель администратора
- ✅ Аутентификация с сохранением сессии (6 месяцев)
- ✅ Управление пользователями
- ✅ Управление статьями
- ✅ Управление креаторами (добавление, редактирование)
- ✅ Управление командами (добавление, редактирование)
- ✅ Управление контентом главной страницы
- ✅ Загрузка изображений в MinIO с WebP конвертацией
- ✅ Поддержка Markdown для контента
- ✅ Статусы публикации (черновик/рецензия/опубликовано)
- ✅ SQL запросы для администрирования БД

### Статьи
- ✅ Поддержка Markdown
- ✅ Изображения заголовков (WebP оптимизация)
- ✅ Метаданные (автор, компания, описание)
- ✅ SEO-friendly URLs (slug система)
- ✅ Адаптивный дизайн

### Изображения
- ✅ Автоматическая конвертация в WebP
- ✅ Сохранение оригинальных файлов
- ✅ Оптимизированная доставка
- ✅ Поддержка всех популярных форматов

## 🔧 Настройка

### Переменные окружения

```bash
# PostgreSQL
POSTGRES_URL=postgresql://koveh:Daniil77Daniil@65.109.88.77:5432/creative_kindness
POSTGRES_USER=koveh
POSTGRES_PASSWORD=Daniil77Daniil
POSTGRES_PORT=5432
POSTGRES_HOST=65.109.88.77
POSTGRES_DB=creative_kindness

# MinIO
MINIO_ENDPOINT=65.109.88.77
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=creative-kindness
NEXT_PUBLIC_MINIO_URL=http://65.109.88.77:9000
```

### Установка зависимостей

```bash
npm install
npm install sharp  # Для обработки изображений
```

### Запуск

```bash
npm run dev
```

## 🧭 Навигация

Проект использует **боковую навигацию** (Sidebar) вместо традиционного верхнего меню:

### Структура навигации:
- **журнал** 📰 - Публикации и статьи
- **креаторы** 👥 - Каталог креаторов
  - маркетинг
  - фото/видео
  - дизайнеры
  - менеджеры
  - инфлюенсеры
- **команды** 🏢 - Команды и организации
- **поддержать нас** ❤️ - Поддержка проекта
- **сотрудничество** 🤝 - Партнерские программы
- **о проекте** ℹ️ - Информация о проекте

### Особенности:
- ✅ Фиксированная боковая панель (256px ширина)
- ✅ Активные состояния для текущей страницы
- ✅ Раскрывающиеся подменю
- ✅ Иконки для каждого раздела
- ✅ Адаптивный дизайн с использованием CSS переменных
- ✅ Поддержка темной/светлой темы
- ✅ Контекстная навигация для статей

## 📁 Структура проекта

```
src/
├── app/
│   ├── admin/           # Панель администратора
│   ├── api/             # API маршруты
│   │   ├── auth/        # Аутентификация
│   │   ├── users/       # Управление пользователями
│   │   ├── articles/    # Управление статьями
│   │   └── upload/      # Загрузка изображений (WebP конвертация)
│   ├── globals.css      # Глобальные стили
│   └── layout.tsx       # Основной layout с боковой навигацией
├── components/
│   ├── ui/              # UI компоненты (shadcn/ui)
│   ├── Header.tsx       # Старый компонент заголовка (заменен на Sidebar)
│   └── Sidebar.tsx      # Новая боковая навигация с контекстным меню
├── lib/
│   ├── auth.ts         # Менеджер аутентификации
│   └── minio.ts        # MinIO клиент для хранения файлов
└── public/
    ├── fonts/          # Шрифты Suisse International
    └── Vector.svg      # Логотип
```

## 🚀 Деплой

### Сервер
- **Домен**: dobro.koveh.com
- **Порт**: 3005
- **SSL**: Let's Encrypt (автообновление)
- **Конфиг**: `/etc/nginx/sites-enabled/dobro.koveh.com.conf`

### Архитектура деплоя
```
Internet → Nginx (443/80) → Next.js (3005) → PostgreSQL → MinIO
```

### Команды для деплоя
```bash
# Обновить nginx
systemctl reload nginx

# Проверить SSL сертификат
certbot certificates

# Обновить сертификаты
certbot renew
```

## 🔄 Взаимосвязи компонентов

```mermaid
graph TD
    A[Frontend] --> B[Next.js API Routes]
    B --> C[PostgreSQL Database]
    B --> D[MinIO Storage]
    
    E[Image Upload] --> F[Sharp Processing]
    F --> G[Original Format]
    F --> H[WebP Format]
    G --> D
    H --> D
    
    I[Sidebar Navigation] --> J[Article Context]
    J --> K[Article Titles Display]
    
    L[Responsive Design] --> M[Mobile Optimization]
    M --> N[Fixed Margins/Padding]
```

## 📈 Производительность

### Оптимизации изображений
- **WebP конвертация**: 80% качества для оптимального баланса
- **Автоматическая обработка**: Sharp.js для быстрой конвертации
- **Двойное хранение**: Оригинал + оптимизированная версия
- **CDN готовность**: MinIO поддерживает CDN интеграцию

### Навигация
- **Контекстное меню**: Динамическое отображение контента
- **Кэширование**: Статические страницы с ISR
- **Оптимизированные запросы**: Минимальные обращения к БД

## 🐛 Исправленные проблемы

1. **Изображения**: Добавлена WebP конвертация и двойное хранение
2. **Адаптивность**: Исправлены отступы на мобильных устройствах
3. **Навигация**: Добавлено контекстное отображение заголовков статей
4. **UX**: Улучшена визуальная иерархия и интерактивность

# Креативное добро - Админ панель

## Обновления админ панели

### Что было улучшено:

1. **Новый дизайн сайдбара** - создан компонент `AdminSidebar` в стиле основного сайта
2. **Улучшенная навигация** - сайдбар теперь соответствует дизайн-системе Creative Kindness
3. **Дашборд** - добавлен главный экран с карточками статистики
4. **Стилизация** - все элементы используют цвета и шрифты основного сайта

### Структура админ панели:

```
/admin
├── layout.tsx (обновлен с новым сайдбаром)
├── admin/
│   └── page.tsx (упрощенная версия с дашбордом)
└── components/
    └── AdminSidebar.tsx (новый компонент)
```

### Функциональность:

- **Дашборд** - обзор системы с карточками статистики
- **Пользователи** - управление пользователями (планируется)
- **Статьи** - просмотр и управление статьями (планируется)
- **Креаторы** - управление креаторами (планируется)
- **Команды** - управление командами (планируется)
- **Главная страница** - настройки главной (планируется)
- **Магазины** - управление магазинами (планируется)
- **SQL запросы** - прямые запросы к БД (планируется)

### Дизайн-система:

- Использует те же цвета: `bg-stone-100`, `bg-white`
- Шрифт: `Suisse_Intl`
- Сайдбар в стиле основного сайта с логотипом
- Карточки с иконками и статистикой

### Следующие шаги:

1. Добавить полную функциональность для каждого раздела
2. Интеграция с S3 для загрузки изображений
3. Управление контентом главной страницы
4. Система ролей и прав доступа

## Deployment Status

### Second Server (89.111.162.25) - societycreate.ru
- **Status**: ✅ Running
- **URL**: https://societycreate.ru
- **Container**: creative_kindness-app-1
- **Port**: 3000 (internal), 3000/3005 (external)
- **Deployed**: September 1, 2025
- **Admin Panel**: Available at https://societycreate.ru/admin

### First Server (Current)
- **Status**: ⏸️ Stopped (port 3005 in use)
- **URL**: localhost:3005
- **Container**: Not running

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   societycreate │    │   Nginx Proxy   │    │  Creative       │
│   .ru (HTTPS)   │───▶│   (Port 443)    │───▶│  Kindness App   │
│                 │    │                 │    │  (Port 3000)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  PostgreSQL DB  │
                       │  (localhost)    │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  MinIO Storage  │
                       │  (65.109.88.77) │
                       └─────────────────┘
```

## Services Running on Second Server
1. **creative_kindness-app-1** - Main application (Port 3000)
2. **creative-kindness-orchid-admin** - Admin panel (Port 8080)
3. **koveh-app** - Koveh website (Port 3001)
4. **PostgreSQL** - Database
5. **MinIO** - Object storage (Port 9000-9001)
6. **Redis** - Cache (Port 6379)
