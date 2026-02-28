# 📚 BEST PRACTICES - LAPLACE

## Express.js + Sequelize Best Practices

### Controller Pattern

```javascript
// ✅ Good - Consistent error handling
exports.getAll = async (req, res) => {
  try {
    const data = await Model.findAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Bad - No error handling
exports.getAll = async (req, res) => {
  const data = await Model.findAll();
  res.json(data);
};
```

### Sequelize Queries

```javascript
// ✅ Good - Select only needed fields
const users = await User.findAll({
  attributes: ['id', 'name', 'email', 'phone'],
  where: { status: 'active' },
});

// ❌ Bad - Fetches all fields including password
const users = await User.findAll();
```

### Pagination

```javascript
// Standard pagination pattern
const { page = 1, limit = 10 } = req.query;
const offset = (parseInt(page) - 1) * parseInt(limit);

const { rows: data, count: total } = await Model.findAndCountAll({
  limit: parseInt(limit),
  offset,
  order: [['createdAt', 'DESC']],
});

res.json({
  success: true,
  data,
  meta: {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  },
});
```

### Repository Pattern

```javascript
// ✅ Good - Use repository for data access
// server/src/models/repository/
const repository = require('../models/repository/accommodationRepo');
const data = await repository.findAllWithFacilities(where, options);
```

---

## Refine Admin Best Practices

### Data Provider

```typescript
// ✅ Good - Use Refine hooks
const { tableProps } = useTable({ resource: "listings" });
const { formProps, saveButtonProps } = useForm();
const { queryResult } = useShow();

// ❌ Bad - Direct API calls in components
useEffect(() => { fetch('/api/accommodations')... }, []);
```

### Resource Registration

```tsx
// App.tsx - Đăng ký resources
<Refine
  resources={[
    {
      name: "listings",
      list: "/listings",
      create: "/listings/create",
      edit: "/listings/edit/:id",
      show: "/listings/show/:id",
    },
  ]}
/>
```

> ⚠️ **Lưu ý:** Admin dùng resource name `"listings"` chứ không phải `"accommodations"`

---

## Next.js 15 Best Practices

### Server vs Client Components

| Server (Default) | Client ('use client') |
|-----------------|----------------------|
| Data fetching | useState, useEffect |
| Static content | Event handlers |
| SEO pages | Browser APIs |
| Layout renders | Forms, interactivity |

### Data Fetching

```tsx
// ✅ Good - Server Component với ISR
async function AccommodationPage({ params }) {
  const data = await fetch(`${API}/accommodations/${params.slug}`, {
    next: { revalidate: 3600 }  // 1 hour
  }).then(r => r.json());

  return <AccommodationDetail data={data.data} />;
}
```

### Error Handling

```tsx
// error.tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-xl font-semibold text-gray-900">Có lỗi xảy ra</h2>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
        Thử lại
      </button>
    </div>
  );
}

// not-found.tsx
export default function NotFound() {
  return <h2>Không tìm thấy trang</h2>;
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Server Controllers | `server/src/controlers/*.js` | ⚠️ Folder name có typo, giữ nguyên |
| Server Routes | `server/src/routes/[module]/index.js` | Folder-based routing |
| Admin Pages | `admin/src/pages/[resource]/*.tsx` | kebab-case folders |
| Client Pages | `client/src/app/[route]/page.tsx` | Vietnamese slug URLs |

---

## Security Best Practices

- ✅ Validate inputs server-side
- ✅ Use Sequelize (ORM prevents SQL injection)
- ✅ Environment variables for secrets
- ✅ Password hashing với bcrypt
- ✅ JWT authentication với expiry + refresh tokens
- ✅ Refresh token rotation (RefreshTokenUsed model)
- ❌ Never expose password/token fields
- ❌ Never trust client-side data

---

## Docker Best Practices

- ✅ Dùng `docker compose` (V2, không phải `docker-compose`)
- ✅ Volume mount cho hot reload (dev)
- ✅ Named volumes cho database persistence
- ✅ Health check cho MySQL trước khi start server
- ✅ Ports: 7201-7205 (trong docker-compose.yml)
- ❌ Không dùng `docker compose down -v` trên production

---

*Updated: 2026-02-24*
