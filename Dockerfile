# Melissa Relief Index — static builder
# Builds the Vite app and outputs dist/ to a shared volume.
# Nginx (main container) serves the dist files directly.
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Export stage — copy dist to volume mount point
FROM alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
# This container's only job is to populate the melissa_dist volume.
CMD ["sh", "-c", "cp -r /app/dist/. /output/ && echo 'Melissa dist copied'"]
