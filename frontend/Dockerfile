# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci --workspace=frontend

COPY frontend ./frontend
RUN npm run build --workspace=frontend

# Production stage
FROM nginx:alpine AS runner
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
# Copy default nginx configuration if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
