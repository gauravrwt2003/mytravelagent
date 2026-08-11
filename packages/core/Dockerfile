FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages/core ./packages/core

RUN npm install --production

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "packages/core/src/index.js"]
