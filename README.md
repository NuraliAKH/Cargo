# Cargo Platform — Single Domain

Единый домен и роутинг:
- `example.com` — лендинг
- `example.com/profile` — личный кабинет
- `example.com/admin` — админ-панель
- `example.com/api/*` — NestJS API

## Технологии
- Frontend: React + Vite + TypeScript + Ant Design + Tailwind CSS
- Backend: NestJS + Prisma ORM + PostgreSQL (только база в Docker)
- Auth: JWT (email/password), роли USER/ADMIN
- Статусы: `AWAITING_AT_WAREHOUSE`, `SHIPPED`, `WITH_COURIER`, `DELIVERED`

---

## Быстрый старт

### 1) Запустить PostgreSQL (только БД в Docker)
```bash
cp .env.example .env
docker compose up -d
```

### 2) Бэкенд
```bash
cd backend
cp .env.example .env
npm i
npx prisma migrate dev --name init
npm run start:dev
```

### 3) Фронтенд (Vite dev + прокси /api → :3000)
```bash
cd ../frontend
npm i
npm run dev
```

### 4) Тестовые шаги
1. Зарегистрируйте пользователя на `/auth` (вкладка Регистрация).
2. В БД вручную можно сделать ADMIN (или создайте через SQL) — пример SQL внизу.
3. В админке `/admin` меняйте статусы посылок.

**SQL для повышения роли до ADMIN:**
```sql
-- Пример: сделать пользователя админом
UPDATE "User" SET role='ADMIN' WHERE email='your@mail.com';
```

---

## Продакшн на одном домене
- Сборка фронта: `cd frontend && npm run build` → `frontend/dist`
- Настройте reverse-proxy (nginx):
  - `/api` → backend (NestJS:3000)
  - `/` → статика из `frontend/dist`

Пример nginx-конфига в `deploy/nginx.example.conf`.
