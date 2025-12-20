# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.17.0

################################################################################
# Base
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

################################################################################
# deps: install all deps (dev included) but SKIP scripts
FROM base AS deps

# bcrypt/node-gyp + prisma engines on alpine
RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json ./

# IMPORTANT: skip postinstall (prisma generate) because prisma/ not copied yet
RUN npm ci --ignore-scripts

################################################################################
# build: copy source, then run prisma generate, then build TS
FROM deps AS build
COPY . .

# Now prisma/schema.prisma exists
RUN npm run prisma:generate
RUN npm run build

################################################################################
# prod-deps: production deps only, also SKIP scripts
FROM base AS prod-deps
RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

################################################################################
# final runtime
FROM node:${NODE_VERSION}-alpine AS final
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=4000

USER node

COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json

EXPOSE 4000
CMD ["node", "dist/server.js"]
