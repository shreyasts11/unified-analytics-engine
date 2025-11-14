# ------------------------------
# Stage 1: Builder
# ------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

# ------------------------------
# Stage 2: Production
# ------------------------------
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server.js"]
