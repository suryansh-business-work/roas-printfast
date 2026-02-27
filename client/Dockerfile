# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite embeds VITE_ env vars at build time
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

RUN npm run build

# ---- Serve Stage ----
FROM node:18-alpine

RUN npm install -g serve@latest

WORKDIR /app

COPY --from=builder /app/dist .

EXPOSE 4036

CMD ["serve", "-s", ".", "-l", "4036"]
