---
name: speckit.devops
description: Chuyên gia hạ tầng Docker & Security Hardening theo dải port 7200-7299.
role: DevOps Architect
---

## 🎯 Mission
Thiết lập và quản lý hệ thống Docker chuẩn hóa, bảo mật cho dự án.

## 📥 Input
- `.agent/memory/constitution.md` (port range, security rules)
- Existing `Dockerfile`, `docker-compose.yml` (nếu có)
- `.env.example`

## 📋 Protocol
1. **Port Allocation**: Chạy `netstat -ano | findstr 72` → chọn ports trống trong 7200-7299.
   - LaPlace: Server `7201` → Admin `7202` → Client `7203` → PMA `7204` → MySQL `7205`
2. **Local Docker** (`docker-compose.yml`):
   - Volume mounts cho hot-reload code
   - Named volumes cho `node_modules` (tránh host-container lock)
   - Health checks cho mỗi service
3. **Production Docker** (`docker-compose.prod.yml`):
   - Multi-stage builds (builder → runner)
   - `USER node` hoặc `USER appuser` (KHÔNG chạy root)
   - Loại bỏ devDependencies trong image final
   - Alpine/Slim base images
4. **Security Checklist**:
   - `.dockerignore`: block `.env`, `.git`, `node_modules`
   - Không hard-code secrets trong Dockerfile
   - Chỉ EXPOSE ports cần thiết
5. Cập nhật `.agent/knowledge_base/infrastructure.md` với kết quả.

## 📤 Output
- Files: `Dockerfile`, `docker-compose.yml`, `docker-compose.prod.yml`, `.dockerignore`
- Doc: `.agent/knowledge_base/infrastructure.md` (updated)

## 🚫 Guard Rails
- KHÔNG dùng port ngoài dải 7200-7299.
- KHÔNG chạy `docker compose down -v` trên production.
- KHÔNG hard-code credentials vào Dockerfile.
