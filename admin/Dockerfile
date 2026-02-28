# ================================================================
# Admin Panel Dockerfile - Vite + React (Refine)
# Optimized multi-stage build for dev and production
# ================================================================

# ================================================================
# Development Stage - Hot-reload development
# ================================================================
FROM node:20-alpine AS dev
WORKDIR /app

# Install dependencies with layer caching
COPY package*.json ./
RUN npm install --prefer-offline --no-audit --legacy-peer-deps

# Copy source code
COPY . .

EXPOSE 7202
CMD ["npm", "start"]

# ================================================================
# Dependencies Stage - Install all dependencies
# ================================================================
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install --prefer-offline --no-audit --legacy-peer-deps

# ================================================================
# Builder Stage - Build Vite application
# ================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# ================================================================
# Production Runner Stage - Minimal Nginx-based image
# ================================================================
FROM nginx:alpine AS runner

# Install wget for health check
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy built static files to Nginx
COPY --from=builder --chown=nodejs:nodejs /app/dist /usr/share/nginx/html

# Custom Nginx config for SPA routing
RUN echo 'server { \
    listen 7202; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    location /api { \
    proxy_pass http://server:8000; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection "upgrade"; \
    proxy_set_header Host $host; \
    proxy_cache_bypass $http_upgrade; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 7202

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:7202/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
