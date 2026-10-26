# API de material por nicho (Cloud Run). Imagem oficial do Puppeteer: já traz o Chrome e as libs.
FROM ghcr.io/puppeteer/puppeteer:23.11.1

ENV NODE_ENV=production TZ=America/Sao_Paulo
WORKDIR /home/pptruser/app

COPY --chown=pptruser:pptruser package*.json ./
RUN npm ci --omit=dev

COPY --chown=pptruser:pptruser src ./src
COPY --chown=pptruser:pptruser assets ./assets

EXPOSE 8080
CMD ["node", "src/server.js"]
