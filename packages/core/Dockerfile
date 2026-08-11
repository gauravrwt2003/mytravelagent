# Dockerfile for GCP Cloud Run Multi-Agent Microservices
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages/core/package*.json ./packages/core/

RUN npm install --production

COPY packages/core ./packages/core

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "packages/core/src/index.js"]
