# Unified Event Analytics Engine

A lightweight analytics backend for collecting events, generating summaries, and managing API keys.

## 🚀 Features
- Event collection endpoint
- Analytics summary (counts, unique users, device stats)
- API key registration, revocation, retrieval
- Swagger documentation
- PostgreSQL + Prisma ORM
- Redis caching
- Docker & Railway deployment ready

## 📦 Tech Stack
- Node.js (TypeScript)
- Express.js
- Prisma ORM
- PostgreSQL
- Redis (Rate limiting & caching)
- Swagger UI
- Docker

## ▶️ Running Locally
npm install
npx prisma migrate dev
npm run dev

## 🐳 Docker Build
docker build -t analytics-engine .
docker run -p 3000:3000 analytics-engine

## 🌐 Swagger Docs
After running:
http://localhost:3000/api/docs

## 📁 Project Structure
src/
 ├── controllers/
 ├── middleware/
 ├── prisma/
 ├── routes/
 ├── docs/

## 📜 License
MIT License
