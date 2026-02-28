# 🤖 AI Content Generator - Hướng dẫn sử dụng

## 📋 Tổng quan

Tính năng **AI Content Generator** giúp tự động tạo nội dung bài viết dựa trên:
- **Từ khóa chính** (Focus Keyword)
- **Tiêu đề bài viết**
- **Cấu hình SEO** từ System Settings

---

## 🎯 Tính năng chính

### 1. **Từ khóa chính (Focus Keyword)**
- Input đầu tiên trong form tạo bài viết
- Dùng để:
  - Tạo **Slug** tự động
  - Tạo **Meta Keywords** tự động
  - Generate nội dung AI theo từ khóa
  - Tối ưu SEO

### 2. **Nút "Tạo nội dung AI"**
- Tự động tạo:
  - **Content** (Nội dung chính với H2, paragraphs)
  - **Excerpt** (Tóm tắt)
  - **Meta Description**
- Dựa trên:
  - Từ khóa chính
  - Tiêu đề bài viết
  - Cấu hình SEO (độ dài, mật độ từ khóa...)

### 3. **Slug từ Keyword**
- **Trước**: Slug tạo từ Title
- **Bây giờ**: Slug tạo từ Focus Keyword
- Lý do: Keyword thường ngắn gọn và SEO-friendly hơn

### 4. **H1 = Title**
- **Trước**: Cần H1 trong content
- **Bây giờ**: Title chính là H1 khi hiển thị
- Content chỉ cần H2, H3, H4...
- SEO Box tự động check H1 = Title

---

## ⚙️ Cấu hình AI

### System Settings (General)

Vào **System → Cấu hình chung** để cấu hình:

| Setting | Mô tả | Giá trị |
|---------|-------|---------|
| `ai_provider` | Nhà cung cấp AI | `gemini` hoặc `chatgpt` |
| `gemini_api_key` | API Key của Google Gemini | Nhập API key |
| `chatgpt_api_key` | API Key của OpenAI ChatGPT | Nhập API key |

### Lấy API Key:

**Google Gemini:**
1. Truy cập: https://makersuite.google.com/app/apikey
2. Tạo API key mới
3. Copy và paste vào `gemini_api_key`

**OpenAI ChatGPT:**
1. Truy cập: https://platform.openai.com/api-keys
2. Tạo API key mới
3. Copy và paste vào `chatgpt_api_key`

---

## 📝 Cách sử dụng

### Bước 1: Nhập từ khóa chính
```
Từ khóa chính: "hướng dẫn sử dụng nextjs"
```

### Bước 2: Nhập tiêu đề
```
Tiêu đề: "Hướng dẫn sử dụng Next.js cho người mới bắt đầu"
```

### Bước 3: Click "Tạo nội dung AI"
- Hệ thống sẽ tự động tạo:
  - Content với H2, paragraphs
  - Excerpt
  - Meta Description
  - Slug (từ keyword)

### Bước 4: Chỉnh sửa nội dung
- Review và chỉnh sửa nội dung AI đã tạo
- Thêm hình ảnh, links
- Điều chỉnh SEO

### Bước 5: Publish
- Check SEO Score
- Publish bài viết

---

## 🔍 SEO Checks

### Tự động check:
- ✅ **H1 = Title** (không cần H1 trong content)
- ✅ **Từ khóa trong Title**
- ✅ **Từ khóa trong Slug**
- ✅ **Từ khóa trong Meta Keywords**
- ✅ **Độ dài Meta Title** (10-70 ký tự)
- ✅ **Độ dài Meta Description** (70-160 ký tự)
- ✅ **Độ dài Slug** (3-100 ký tự)

---

## 🚀 Roadmap

### Hiện tại (Mock):
- ✅ UI/UX hoàn chỉnh
- ✅ Tích hợp form
- ✅ SEO checks
- ⏳ Mock data (chưa gọi API thật)

### Sắp tới:
- [ ] Tích hợp Gemini API
- [ ] Tích hợp ChatGPT API
- [ ] Tùy chỉnh prompt template
- [ ] Lưu lịch sử generate
- [ ] A/B testing nội dung

---

## 📚 Tham khảo

- [Google Gemini API](https://ai.google.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [SEOquake Guide](https://www.seoquake.com/guide/)

