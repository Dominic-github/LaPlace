# 🔗 Tự động sinh Slug & Meta Description

## 📋 Tổng quan

Tính năng tự động sinh slug và meta description giúp tạo URL thân thiện (SEO-friendly) và mô tả tối ưu cho công cụ tìm kiếm.

---

## 🎯 Cách hoạt động

### 1. Logic tự động sinh Slug:

**Khi blur (rời khỏi) input Tiêu đề**:
- Nếu **Slug đang rỗng** → Tự động sinh slug từ tiêu đề
- Nếu **Slug đã có giá trị** → Không tự động sinh (giữ nguyên giá trị user đã nhập)

**Quy tắc chuyển đổi**:
- Chuyển ký tự tiếng Việt có dấu → không dấu
- Chuyển chữ hoa → chữ thường
- Xóa ký tự đặc biệt (chỉ giữ chữ cái, số, dấu gạch ngang)
- Thay khoảng trắng → dấu gạch ngang (-)
- Xóa dấu gạch ngang liên tiếp
- Xóa dấu gạch ngang ở đầu/cuối

### 2. Logic tự động sinh Meta Description:

**Khi thay đổi input Tóm tắt (Excerpt)**:
- Nếu **Meta Description đang rỗng** → Tự động sinh từ Tóm tắt
- Nếu **Meta Description đã có giá trị** → Không tự động sinh (giữ nguyên)

**Quy tắc xử lý**:
- Xóa tất cả thẻ HTML (`<p>`, `<strong>`, `<br>`, v.v.)
- Decode HTML entities (`&nbsp;`, `&amp;`, v.v.)
- Xóa khoảng trắng thừa
- Cắt ngắn về 160 ký tự (độ dài tối ưu cho SEO)
- Cắt tại ranh giới từ (không cắt giữa từ)
- Thêm dấu `...` nếu bị cắt ngắn

---

## 💡 Ví dụ

### Chuyển đổi tiếng Việt:

| Tiêu đề | Slug tự động |
|---------|--------------|
| `Hướng dẫn sử dụng Next.js` | `huong-dan-su-dung-nextjs` |
| `Xin chào các bạn` | `xin-chao-cac-ban` |
| `Đây là tiêu đề` | `day-la-tieu-de` |
| `Top 10 mẹo hay` | `top-10-meo-hay` |

### Xử lý ký tự đặc biệt:

| Tiêu đề | Slug tự động |
|---------|--------------|
| `Hello @World!` | `hello-world` |
| `Test #123 $456` | `test-123-456` |
| `Foo & Bar` | `foo-bar` |
| `React   và   Vue` | `react-va-vue` |

---

## 🔧 Sử dụng

### Trong component Post Create/Edit:

```tsx
import { slugify } from "../../utils/slugify";

// Xử lý khi blur khỏi input Title
const handleTitleBlur = () => {
  const title = form.getFieldValue('title');
  const currentSlug = form.getFieldValue('slug');
  
  // Chỉ tự động sinh slug nếu slug đang rỗng
  if (!currentSlug && title) {
    const generatedSlug = slugify(title);
    form.setFieldsValue({ slug: generatedSlug });
  }
};

// Thêm onBlur vào input Title
<Input
  placeholder="Nhập tiêu đề bài viết"
  onBlur={handleTitleBlur}
/>
```

---

## 📚 API Reference

### `slugify(text: string): string`

Chuyển đổi chuỗi thành slug URL-friendly.

**Parameters:**
- `text` (string): Chuỗi cần chuyển đổi

**Returns:**
- `string`: Slug đã được chuẩn hóa

**Example:**
```typescript
slugify("Hướng dẫn sử dụng Next.js")
// => "huong-dan-su-dung-nextjs"

slugify("Xin chào các bạn!")
// => "xin-chao-cac-ban"
```

---

### `makeUniqueSlug(baseSlug: string, existingSlugs: string[]): string`

Tạo slug unique bằng cách thêm số vào cuối nếu slug đã tồn tại.

**Parameters:**
- `baseSlug` (string): Slug gốc
- `existingSlugs` (string[]): Mảng các slug đã tồn tại

**Returns:**
- `string`: Slug unique

**Example:**
```typescript
makeUniqueSlug("hello-world", ["hello-world"])
// => "hello-world-1"

makeUniqueSlug("hello-world", ["hello-world", "hello-world-1"])
// => "hello-world-2"
```

---

### `isValidSlug(slug: string): boolean`

Kiểm tra slug có hợp lệ hay không.

**Parameters:**
- `slug` (string): Slug cần kiểm tra

**Returns:**
- `boolean`: `true` nếu slug hợp lệ

**Example:**
```typescript
isValidSlug("hello-world")  // => true
isValidSlug("Hello-World")  // => false (có chữ hoa)
isValidSlug("hello_world")  // => false (có underscore)
isValidSlug("hello--world") // => false (dấu gạch ngang liên tiếp)
```

---

## ✅ Quy tắc Slug hợp lệ

Một slug hợp lệ phải:
- ✅ Chỉ chứa chữ thường (a-z)
- ✅ Chỉ chứa số (0-9)
- ✅ Chỉ chứa dấu gạch ngang (-)
- ✅ Không bắt đầu bằng dấu gạch ngang
- ✅ Không kết thúc bằng dấu gạch ngang
- ✅ Không có dấu gạch ngang liên tiếp

**Ví dụ hợp lệ:**
- `hello-world`
- `test-123`
- `abc`
- `a-b-c-d-e`

**Ví dụ không hợp lệ:**
- `Hello-World` (chữ hoa)
- `hello_world` (underscore)
- `hello world` (khoảng trắng)
- `hello--world` (dấu gạch ngang liên tiếp)
- `-hello` (bắt đầu bằng dấu gạch ngang)
- `hello-` (kết thúc bằng dấu gạch ngang)

---

## 🧪 Testing

Chạy test cho slugify utility:

```bash
cd admin
npm test -- slugify.test.ts
```

---

## 🎨 User Experience

### Kịch bản 1: Tạo bài viết mới
1. User nhập tiêu đề: "Hướng dẫn sử dụng Next.js"
2. User click ra ngoài (blur)
3. Slug tự động điền: "huong-dan-su-dung-nextjs"
4. User có thể chỉnh sửa slug nếu muốn

### Kịch bản 2: User tự nhập slug
1. User nhập tiêu đề: "Hướng dẫn sử dụng Next.js"
2. User tự nhập slug: "nextjs-guide"
3. User click ra ngoài (blur)
4. Slug giữ nguyên: "nextjs-guide" (không tự động sinh)

### Kịch bản 3: Chỉnh sửa tiêu đề
1. User đã có slug: "nextjs-guide"
2. User sửa tiêu đề: "Hướng dẫn React"
3. User click ra ngoài (blur)
4. Slug giữ nguyên: "nextjs-guide" (không tự động sinh vì đã có giá trị)

---

**Tạo bởi**: Webest Group  
**Website**: https://webest.asia

