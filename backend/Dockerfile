# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --workspace=backend

# Build stage
FROM base AS builder
WORKDIR /app
COPY backend ./backend
RUN npm run build --workspace=backend

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --omit=dev --workspace=backend

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

EXPOSE 5001
WORKDIR /app/backend
CMD ["npm", "start"]
