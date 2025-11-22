FROM node:24.0.0-slim AS builder

WORKDIR /app

# Aumentar límite de memoria para Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Argumentos de build
ARG VITE_API_BASE_URL
ARG VITE_API_MOBILE_URL
ARG VITE_API_MOBILE_KEY

# Convertir ARG a ENV para que Vite las vea durante el build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_MOBILE_URL=$VITE_API_MOBILE_URL
ENV VITE_API_MOBILE_KEY=$VITE_API_MOBILE_KEY

# Habilitar corepack y yarn
RUN corepack enable \
 && corepack prepare yarn@1.22.22 --activate \
 && yarn --version

# Copiar archivos de dependencias
COPY package.json yarn.lock ./

# Instalar dependencias con timeout extendido
RUN yarn install --network-timeout 600000

# Copiar código fuente
COPY . .

# Build de producción con más memoria
RUN yarn build

# Verificar que el build fue exitoso
RUN ls -la /app/dist

FROM nginx:1.27-alpine AS runtime

# Metadatos de la imagen
LABEL maintainer="Santa Ana Agroforms"
LABEL version="1.0.0"
LABEL description="Santa Ana Agroforms - Frontend Application"

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Variables de entorno
ENV NODE_ENV=production
ENV TZ=America/Guatemala

# Configurar timezone
RUN apk add --no-cache tzdata \
 && cp /usr/share/zoneinfo/$TZ /etc/localtime \
 && echo $TZ > /etc/timezone \
 && apk del tzdata

# Crear directorios necesarios para nginx con permisos correctos
RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
             /var/log/nginx \
             /var/run \
 && chown -R nginx:nginx /var/cache/nginx \
 && chown -R nginx:nginx /var/log/nginx \
 && chown -R nginx:nginx /var/run \
 && chown -R nginx:nginx /usr/share/nginx/html \
 && chmod -R 755 /var/cache/nginx \
 && chmod -R 755 /var/log/nginx \
 && touch /var/run/nginx.pid \
 && chown nginx:nginx /var/run/nginx.pid

# Verificar que los archivos fueron copiados correctamente
RUN ls -la /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Cambiar a usuario no-root
USER nginx

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]