FROM node:25-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --production
RUN npx esbuild build/server.js \
    --bundle \
    --platform=node \
    --target=node25 \
    --outfile=build/app.js

FROM node:25-alpine
WORKDIR /app

COPY --from=builder /app/build/app.js ./app.js

RUN adduser -D app
USER app

EXPOSE 8080
CMD ["node", "app.js"]

