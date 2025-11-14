
FROM node:18-alpine AS builder

WORKDIR /app


COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm install


RUN npx prisma generate


COPY . .


RUN npm run build



FROM node:18-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install --only=production


COPY prisma ./prisma


COPY --from=builder /app/dist ./dist


COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server.js"]
