-- Creative Kindness Platform Database Schema
-- PostgreSQL Database

-- Create database (run as superuser)
-- CREATE DATABASE creative_kindness;

-- Connect to the database
-- \c creative_kindness;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
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

-- Таблица статей
CREATE TABLE IF NOT EXISTS articles (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_email) REFERENCES users(email)
);

-- Таблица креаторов (Creators)
CREATE TABLE IF NOT EXISTS creators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    image VARCHAR(500),
    description TEXT,
    link VARCHAR(500),
    slug VARCHAR(255) UNIQUE,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица команд (Teams)
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    image VARCHAR(500),
    description TEXT,
    link VARCHAR(500),
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица контента главной страницы
CREATE TABLE IF NOT EXISTS main_page_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_articles_link ON articles(link);
CREATE INDEX IF NOT EXISTS idx_creators_slug ON creators(slug);
CREATE INDEX IF NOT EXISTS idx_creators_category ON creators(category);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_teams_category ON teams(category);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Пользователи системы с ролями и правами доступа';
COMMENT ON TABLE articles IS 'Статьи журнала с поддержкой Markdown и метаданных';
COMMENT ON TABLE creators IS 'Каталог креаторов с категориями и профилями';
COMMENT ON TABLE teams IS 'Команды и организации, участвующие в проекте';
COMMENT ON TABLE main_page_content IS 'Контент для главной страницы платформы';
