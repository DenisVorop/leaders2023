FROM node:latest as deps
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci

FROM node:latest as builder
WORKDIR /app
COPY ./ .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:latest as runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY ./src ./src
COPY ./.env* .
 
