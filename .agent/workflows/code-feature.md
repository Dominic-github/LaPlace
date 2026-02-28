---
description: Triển khai tính năng mới cho LaPlace (Server + Admin + Client)
---

# 💻 CODE FEATURE WORKFLOW

---

## AGENTS

| Agent | File |
|-------|------|
| Coder | `instructions/coder.prompt` |
| Security | `instructions/security.prompt` |

---

## PHASES

### 1. Analysis

- Xác định feature từ `tasks.md`
- Check Sequelize model có đủ fields
- Check backend API endpoint tương ứng
- Xác định cần sửa ở đâu: Server / Admin / Client

### 2. Backend (nếu cần)

#### Sequelize Model

```javascript
// models/NewModel.js
module.exports = (sequelize, DataTypes) => {
  const NewModel = sequelize.define('NewModel', {
    // fields
  }, { tableName: 'new_models', timestamps: true });
  return NewModel;
};
```

#### Controller

```javascript
// controlers/newController.js
exports.getAll = async (req, res) => {
  try {
    const data = await NewModel.findAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

#### Route

```javascript
// routes/new.js
router.get('/', controller.getAll);
router.post('/', authenticate, authorize('admin'), controller.create);
```

### 3. Admin (nếu cần)

```tsx
// pages/new-resource/list.tsx
import { List, useTable } from "@refinedev/antd";
import { Table } from "antd";

export const NewResourceList = () => {
  const { tableProps } = useTable({ resource: "new-resources" });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {/* columns */}
      </Table>
    </List>
  );
};
```

### 4. Client (nếu cần)

```tsx
// app/new-page/page.tsx
async function NewPage() {
  const res = await fetch(`${API}/new-resources`, {
    next: { revalidate: 3600 }
  });
  const { data } = await res.json();
  return <NewPageClient data={data} />;
}
```

### 5. Validation

```powershell
# Check server logs
docker compose logs -f server

# Check admin
docker compose logs -f admin

# Check client
docker compose logs -f client
```

---

## REFERENCES

- Components: `knowledge_base/reusable_components.md`
- Schema: `knowledge_base/database_schema.md`
- Tasks: `tasks.md`
