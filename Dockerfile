# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.17.0

FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /usr/src/app

# deps
FROM base AS deps
RUN apt-get update && apt-get install -y \
  openssl ca-certificates python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# build
FROM deps AS build
COPY . .
RUN npm run prisma:generate
RUN npm run build

# prod-deps
FROM base AS prod-deps
RUN apt-get update && apt-get install -y \
  openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# final
FROM base AS final
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=4000

RUN apt-get update && apt-get install -y \
  openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json

RUN useradd -m nodeuser && chown -R nodeuser:nodeuser /usr/src/app
USER nodeuser

EXPOSE 4000
CMD ["node", "dist/server.js"]
