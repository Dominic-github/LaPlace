---
trigger: always_on
glob: "**/*"
description: WB-Agent Workspace Rules cho laplace - ASF 3.3 Standard
---

# 🛡️ WB-Agent Workspace Rules

Dự án: laplace

## 1. PHÁP LỆNH TỐI CAO
- Tuân thủ nghiêm ngặt file `.agent/memory/constitution.md`.
- Docker-First: Mọi hoạt động code và chạy app phải diễn ra trong container. KHÔNG chạy node/python trên host.
- Ports: Dải port 7200-7299 (Server:7201, Admin:7202, Client:7203, PMA:7204, MySQL:7205).

## 2. WB-AGENT PROTOCOL
- Mọi task phải đi qua quy trình: Specify → Plan → Tasks → Implement.
- Sử dụng Workflows trong `.agent/workflows/` và Skills trong `.agent/skills/`.

## 3. NGÔN NGỮ & CODE
- Phản hồi developer hoàn toàn bằng Tiếng Việt.
- 15-Minute Rule: Mỗi task phải atomic, ≤ 15 phút, ảnh hưởng ≤ 3 files.
- PowerShell 5.1+, ngăn cách lệnh bằng dấu `;` (KHÔNG dùng `&&`).
- KHÔNG hard-code URLs, Tokens, Keys. Dùng ENV vars (`.env`).

## 4. AN TOÀN
- KHÔNG chạy `docker compose down -v` trên Production.
- Tạo script tự động (`.agent/scripts/`) cho lỗi lặp lại.
- Kiểm tra logs ngay khi lỗi: `docker compose logs -f <service>`.

