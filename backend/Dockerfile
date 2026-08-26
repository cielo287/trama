# ---------- Etapa de build ----------
FROM node:24-slim AS build

WORKDIR /app

# Prisma necesita openssl para generar el client correctamente
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# ---------- Etapa de producción ----------
FROM node:24-slim AS production

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV TZ=America/Argentina/Cordoba

COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos el Prisma Client ya generado en la etapa de build
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/dist ./dist



CMD ["node", "dist/main"]