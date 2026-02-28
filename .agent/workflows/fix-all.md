---
description: Debug, QA và Tối ưu hóa hệ thống LaPlace
---

# 🔧 FIX-ALL WORKFLOW

---

## DIAGNOSTIC

```powershell
# Check Docker containers
docker compose ps

# Check server logs
docker compose logs server --tail=50

# Check admin logs
docker compose logs admin --tail=50

# Check client logs
docker compose logs client --tail=50

# Check ports
netstat -ano | findstr "720"
```

---

## COMMON ISSUES

### 1. Server không start

```powershell
# Check MySQL connection
docker compose logs mysql --tail=20

# Vào server container
docker exec -it laplace_server sh

# Run migrations
yarn sequelize-cli db:migrate

# Check env
env | grep DB_

# Restart
docker compose restart server
```

### 2. Admin không login được

- Check API URL: `VITE_API_URL=http://localhost:7201`
- Check CORS trong server
- Check credentials: `admin@laplace.com` / `admin123`
- Check server logs: `docker compose logs -f server`

### 3. MySQL connection refused

```powershell
# Check MySQL health
docker compose ps mysql

# Wait for MySQL to be ready
docker compose logs -f mysql

# Restart MySQL
docker compose restart mysql

# Then restart server
docker compose restart server
```

### 4. Client build lỗi

```powershell
# Check TypeScript errors
docker exec -it laplace_client npx tsc --noEmit

# Clear .next cache
docker exec -it laplace_client rm -rf .next
docker compose restart client
```

### 5. File upload không hoạt động

- Check upload directory: `server/public/uploads/`
- Check volume mount trong docker-compose.yml
- Check `MAX_FILE_SIZE` trong .env
- Check multer middleware trong server

---

## QA CHECKLIST

### Server API

- [ ] GET /api/accommodations trả data đúng
- [ ] POST /api/auth/login hoạt động
- [ ] CRUD operations cho accommodations
- [ ] Pagination, sorting, filtering
- [ ] Auth middleware bảo vệ routes

### Admin Panel

- [ ] Login hoạt động
- [ ] Dashboard hiển thị data
- [ ] CRUD accommodations hoạt động
- [ ] File upload hoạt động
- [ ] Reports hiển thị đúng

### Client Website

- [ ] Homepage load đúng
- [ ] Search/Filter hoạt động
- [ ] Accommodation detail hiển thị
- [ ] Responsive trên mobile

---

## PERFORMANCE

```powershell
# Check container resources
docker stats

# Check MySQL slow queries
docker exec -it laplace_mysql mysql -u root -prootpassword -e "SHOW PROCESSLIST"

# Check server API response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:7201/api/accommodations
```
