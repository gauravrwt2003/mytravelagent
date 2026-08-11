# Stage 1: Build Web Frontend
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/web/package*.json ./packages/web/

RUN npm install

COPY packages/core ./packages/core
COPY packages/web ./packages/web

RUN npm run build --workspace=packages/web

# Stage 2: Serve via Nginx
FROM nginx:alpine
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
