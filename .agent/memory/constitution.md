# 📜 Project Constitution

## §0 WB-Agent Protocol (MANDATORY)
- **BẮT BUỘC**: Mọi hoạt động phát triển (Code), kiểm thử (Test), và triển khai (Deploy Production) PHẢI sử dụng `wb-agent`.
- **Pipeline**: Tuân thủ nghiêm ngặt quy trình: Specify → Plan → Tasks → Implement.
- **Tools**: Chỉ sử dụng các workflows trong `.agent/workflows` để thực hiện task.

## §1 Infrastructure (DOCKER-FIRST)
- **Mặc định dùng Docker** cho cả Local và Production. KHÔNG chạy `npm`/`node`/`python` trực tiếp trên host.
- **Local**: Dùng `docker-compose.yml` để dev.
- **Production**: Dùng `docker-compose.prod.yml` kèm Security Hardening.
- **Ports (LaPlace)**: Dải **7201-7205** (theo docker-compose.yml thực tế).
  - Server API: `7201` | Admin: `7202` | Client: `7203` | phpMyAdmin: `7204` | MySQL: `7205`
  - ⚠️ Chỉ dùng dải 7200-7299 — xem docker-compose.yml là source of truth.
- **Lệnh PowerShell**: Dùng PowerShell 5.1+, ngăn cách lệnh bằng `;` (KHÔNG dùng `&&`).

## §2 Security & Production Safety
- **CẤM**: `docker compose down -v` trên Production.
- **CẤM**: Deploy thủ công (phải dùng workflows `/deploy-production` hoặc `/deploy-staging`).
- **Xác nhận**: Yêu cầu xác nhận trước khi Deep Clean, Deploy Prod, hoặc Delete Data.
- **Runtime**: Production containers KHÔNG chạy quyền root.

## §3 Code Standards & ENV
- **CẤM hard-code**: URLs, Tokens, Keys, Credentials, Endpoints, Default Text.
- **Sensitive vars**: PHẢI dùng ENV (`.env` local, server ENV prod).
  - Prefix: `NEXT_PUBLIC_*`, `API_*`, `DB_*`.
- **Validate**: 
  - Critical vars: `throw new Error()` nếu thiếu.
  - Optional vars: `console.error()` nếu thiếu.
- **Documentation**: Phải có `.env.example` đầy đủ.

## §4 Workflow & Scripting
- **Tự động hóa**: Tạo script khi gặp lỗi hoặc task lặp lại.
- **Git**: Lưu script vào `.agent/scripts`, commit vào hệ thống version control.
- **Update**: Cập nhật workflow tương ứng sau khi tạo script mới.

## §5 Design System (LaPlace Frontend)

### 5.1 Color Palette
| Token | Hex | Vai trò |
|---|---|---|
| `primary-500` | `#8b5cf6` | Violet — Màu chủ đạo |
| `primary-600` | `#7c3aed` | Violet đậm — CTA, buttons, links active |
| `primary-700` | `#6d28d9` | Violet hover states |
| `secondary-500` | `#d946ef` | Fuchsia — Gradient endpoint, accent |
| `secondary-600` | `#c026d3` | Fuchsia hover |
| `accent` | `#facc15` | Yellow — Điểm nhấn, badge, highlight |
| `surface-50` → `surface-900` | Slate scale | Nền, text, borders (dựa trên Tailwind Slate) |

- **Primary gradient**: `from-primary-600 to-secondary-500` (Violet → Fuchsia)
- **Text gradient**: `.text-gradient` = `bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500`
- **Neon shadow**: `0 0 15px rgba(124, 58, 237, 0.5)` cho CTA buttons
- **CẤM** dùng màu generic (plain red, blue, green) — Luôn dùng palette ở trên.

### 5.2 Typography
| Font | Vai trò | Weights |
|---|---|---|
| **Outfit** | Headings, display text, giá cả | 300–800 |
| **Inter** | Body text, UI labels | 400–600 |

- `font-sans`: `Outfit, Inter, system-ui, sans-serif`
- `font-display`: `Outfit, system-ui, sans-serif` — Dùng cho h1, h2, giá tiền
- Body color: `surface-800` (`#1e293b`)
- Body background: `surface-50` (`#f8fafc`)

### 5.3 Component Classes (globals.css)
| Class | Mô tả |
|---|---|
| `.btn` | Base button: `px-6 py-3 rounded-xl font-semibold text-sm` |
| `.btn-primary` | Gradient CTA + neon shadow + hover lift |
| `.btn-secondary` | White bg + primary border + soft shadow |
| `.btn-ghost` | Transparent, hover surface-50 |
| `.btn-sm` | Pill button nhỏ: `px-4 py-2 rounded-full` |
| `.btn-accent` | Yellow highlight button |
| `.card-modern` | Card: `rounded-3xl`, soft shadow, hover ring |
| `.glass` / `.glass-dark` | Glassmorphism effect |
| `.input-modern` | Input: `rounded-xl`, focus primary ring |
| `.input-field` | Input nhẹ hơn: `rounded-xl border-slate-200` |
| `.input-label` | Label: `text-sm font-semibold` |
| `.badge-modern` | Badge: `rounded-full text-xs font-bold uppercase` |
| `.text-gradient` | Gradient text: primary → secondary |
| `.container-page` | Page container: `max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8` |
| `.scrollbar-hide` | Ẩn scrollbar cho horizontal scroll |

### 5.4 Design Patterns (BẮT BUỘC)
1. **Filter Tabs/Pills**: Dùng `rounded-full`, active = gradient `from-primary-600 to-secondary-500 text-white shadow-md`, inactive = `bg-white text-slate-600 border border-slate-200`
2. **Cards**: `rounded-2xl` hoặc `rounded-3xl`, `border border-slate-100`, hover = `shadow-xl + -translate-y-1`
3. **Page Headers**: `text-4xl md:text-5xl font-extrabold font-display tracking-tight`, subtitle = `text-lg text-slate-500 font-medium`
4. **Pagination**: Dùng component `Pagination.tsx` dùng chung — numbered pages, KHÔNG chỉ Trước/Sau
5. **Inputs**: Icon bên trái (`absolute left-4`), `rounded-xl`, `focus:ring-2 focus:ring-primary-500/30`
6. **Shadows**: `shadow-soft` cho cards, `shadow-neon` cho CTA, `shadow-glass` cho glass effects
7. **Animations**: `transition-all duration-300`, hover = `scale-105` (images) / `-translate-y-1` (cards)
8. **Spacing**: Section padding = `py-20` hoặc `py-24`, card gap = `gap-6 md:gap-8`
9. **Border Radius**: Cards = `rounded-2xl`/`rounded-3xl`, Buttons = `rounded-xl`/`rounded-full`, Inputs = `rounded-xl`

### 5.5 Responsive Breakpoints
| Breakpoint | Prefix | Sử dụng |
|---|---|---|
| 640px | `sm:` | Mobile landscape |
| 768px | `md:` | Tablet |
| 1024px | `lg:` | Desktop |
| 1280px | `xl:` | Wide desktop |

- Grid mặc định: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Container: `max-w-[1400px]`
