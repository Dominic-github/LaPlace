---
description: Khởi tạo service mới hoặc scaffold cho LaPlace
---

# 🚀 START NEW WORKFLOW

---

## A. SCAFFOLD CLIENT (Next.js 15)

### 1. Initialize

```powershell
# Scaffold Next.js 15 với TypeScript + Tailwind
npx create-next-app@latest ./client --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Tailwind Config

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3498db',
          dark: '#2980b9',
          light: '#5dade2',
        },
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
        text: {
          DEFAULT: '#2c3e50',
          light: '#7f8c8d',
        },
        background: '#ecf0f1',
        border: '#bdc3c7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### 3. Environment

```env
# client/.env
NEXT_PUBLIC_API_URL=http://localhost:7201
NEXT_PUBLIC_SITE_URL=http://localhost:7203
```

### 4. Utilities

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/format.ts
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function formatPricePerMonth(price: number): string {
  return formatPrice(price) + '/tháng';
}
```

### 5. Folder Structure

```
client/src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx           # Homepage
│   │   ├── tim-phong/         # Search
│   │   └── phong-tro/[slug]/  # Detail
│   ├── (auth)/
│   │   ├── dang-nhap/
│   │   └── dang-ky/
│   ├── tai-khoan/             # Protected
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   ├── accommodation/
│   └── booking/
└── lib/
    ├── api.ts
    ├── utils.ts
    └── format.ts
```

### 6. Dependencies

```powershell
npm install clsx tailwind-merge zustand
```

---

## B. ADD NEW BACKEND MODULE

### 1. Create Model

```powershell
# Tạo migration
cd server
yarn sequelize-cli model:generate --name NewModel --attributes title:string,status:string
```

### 2. Run Migration

```powershell
docker exec -it laplace_server sh
yarn sequelize-cli db:migrate
```

### 3. Create Controller + Routes

- `server/src/controlers/newController.js`
- `server/src/routes/new.js`
- Register route trong `server/src/server.js`

---

## C. Docker Integration

### Add new service to docker-compose.yml

```yaml
new-service:
  build:
    context: ./new-service
    dockerfile: Dockerfile
    target: dev
  container_name: laplace_new_service
  restart: unless-stopped
  ports:
    - "720X:720X"
  volumes:
    - ./new-service:/app
    - /app/node_modules
  networks:
    - laplace_network
```

---

## REFERENCES

- Identity: `.agent/identity/master-identity.md`
- Tasks: `.agent/tasks.md`
- Docker: `docker-compose.yml`
