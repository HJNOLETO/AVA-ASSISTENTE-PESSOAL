FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --frozen-lockfile

COPY . .

# ENTRYPOINT define que o container vai sempre executar nosso CLI por padrão.
# Você pode passar os comandos via "docker run" apendando após a imagem (ex: --help)
ENTRYPOINT ["npx", "tsx", "cli/index.ts"]
CMD ["--help"]

USER node
