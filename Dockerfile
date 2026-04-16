FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]
