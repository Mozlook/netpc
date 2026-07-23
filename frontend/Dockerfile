# --- Build stage: produce the static SPA bundle ---
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first (cached layer) from the lockfile.
COPY package*.json ./
RUN npm ci

# Empty base URL -> API calls are relative (/api/...), served same-origin via nginx proxy.
ENV VITE_API_BASE_URL=""

COPY . ./
RUN npm run build

# --- Runtime stage: serve static files + proxy /api with nginx ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
