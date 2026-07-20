# FinTrack — Personal Finance Tracker

*A minimalistic, premium personal finance tracking web application built with React and Express made by Askar Turanazarov.* 

---

## 🇬🇧 English

### 📖 About

FinTrack helps you track your income, expenses, and recurring payments.  
It provides a clear dashboard with charts, monthly summaries, and category breakdowns.  
Built with a modern dark UI inspired by Stripe and Revolut.

### ✨ Features

- User authentication (JWT-based)
- Income & expense management with CRUD operations
- Custom categories and income sources
- Monthly dashboard with pie & bar charts
- Recurring transaction support
- Responsive design (mobile-friendly)
- SQLite (dev) / PostgreSQL (prod) database support
- Secure (bcrypt, Helmet, CORS, rate limiting)

### 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons |
| Backend  | Node.js, Express, TypeScript        |
| Database | SQLite (development), PostgreSQL (production) |
| Auth     | JWT + bcrypt                        |
| Validation | Zod                               |
| Security | Helmet, CORS, express-rate-limit   |

### 🚀 Quick Start

#### Prerequisites

- Node.js v18+
- npm

#### 1. Clone the repository

```bash
git clone https://github.com/Askar-Turanazarov/FinTrack-project.git
cd FinTrack-project


2. Backend setup

cd backend
npm install
cp .env.example .env   # edit .env with your settings
npm run db:init         # seed system categories
npm run dev             # starts on http://localhost:4000

3. Frontend setup

cd frontend
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:4000/api
npm run dev             # starts on http://localhost:5173


______________________________
📁 Project Structure

FinTrack-project/
├── backend/
│   ├── src/
│   │   ├── config/         # environment variables
│   │   ├── db/             # database client & schema
│   │   ├── middleware/     # auth, validation, error handling
│   │   ├── modules/        # auth, income-sources, incomes, categories, expenses, summary
│   │   └── utils/          # JWT, password hashing
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── api/            # HTTP client & endpoints
│   │   ├── components/     # reusable UI components
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Dashboard, Incomes, Expenses, etc.
│   │   └── types/          # shared TypeScript interfaces
│   └── ...
└── README.md



🔐 Environment Variables (backend/.env)

PORT=4000
NODE_ENV=development
DATABASE_URL=./data/fintrack.db
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173

📄 License
This project is for personal educational purposes.

🇷🇺 Русский
📖 О проекте
FinTrack — это веб-приложение для учёта личных финансов: доходов, расходов, постоянных платежей.
Предоставляет дашборд с графиками, разбивкой по категориям и источникам дохода.
Интерфейс выполнен в премиальном тёмном стиле, вдохновлённом Stripe и Revolut.

✨ Возможности
Аутентификация по JWT

Управление доходами и расходами (CRUD)

Пользовательские категории и источники дохода

Помесячная сводка с круговыми и столбчатыми диаграммами

Поддержка повторяющихся транзакций

Адаптивный дизайн для мобильных устройств

Поддержка SQLite (разработка) / PostgreSQL (продакшн)

Защита (bcrypt, Helmet, CORS, ограничение частоты запросов)

🛠️ Технологический стек
Слой	Технологии
Фронтенд	React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
Бэкенд	Node.js, Express, TypeScript
База данных	SQLite (разработка), PostgreSQL (продакшн)
Аутентификация	JWT + bcrypt
Валидация	Zod
Безопасность	Helmet, CORS, express-rate-limit
🚀 Быстрый старт
Требования
Node.js v18+

npm

1. Клонирование репозитория

git clone https://github.com/Askar-Turanazarov/FinTrack-project.git
cd FinTrack-project

2. Настройка бэкенда

cd backend
npm install
cp .env.example .env   # отредактируйте .env под свои настройки
npm run db:init         # заполнение системных категорий
npm run dev             # запуск на http://localhost:4000

3. Настройка фронтенда

cd frontend
npm install
# Создайте файл .env с содержимым:
# VITE_API_URL=http://localhost:4000/api
npm run dev             # запуск на http://localhost:5173

📁 Структура проекта

FinTrack-project/
├── backend/
│   ├── src/
│   │   ├── config/         # переменные окружения
│   │   ├── db/             # клиент БД и схема
│   │   ├── middleware/     # аутентификация, валидация, обработка ошибок
│   │   ├── modules/        # auth, income-sources, incomes, categories, expenses, summary
│   │   └── utils/          # JWT, хэширование паролей
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── api/            # HTTP-клиент и endpoints
│   │   ├── components/     # переиспользуемые UI-компоненты
│   │   ├── context/        # контекст авторизации
│   │   ├── pages/          # страницы: дашборд, доходы, расходы и т.д.
│   │   └── types/          # общие TypeScript-интерфейсы
│   └── ...
└── README.md

🔐 Переменные окружения (backend/.env)

PORT=4000
NODE_ENV=development
DATABASE_URL=./data/fintrack.db
JWT_SECRET=ваш_секретный_ключ
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173

📄 Лицензия
Проект создан в личных образовательных целях.

