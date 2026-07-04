# Imagem mínima para servir o site estático (Cloud Run)
FROM nginx:1.27-alpine

# Configurar timezone para America/Sao_Paulo (GMT-3)
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone && \
    apk del tzdata

ENV TZ=America/Sao_Paulo

# Config do nginx (gzip + cache + porta 8080 + clean URLs)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Conteúdo do site (o .dockerignore exclui _modelo/, partials/, *.md, etc.)
COPY . /usr/share/nginx/html/

# Remove arquivos que não devem ser servidos publicamente
RUN rm -f /usr/share/nginx/html/nginx.conf /usr/share/nginx/html/Dockerfile

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
