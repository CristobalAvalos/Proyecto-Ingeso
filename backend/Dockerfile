# Dockerfile para desarrollo con hot-reload
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluye dev dependencies para hot-reload)
RUN npm install --legacy-peer-deps

# El código se monta como volumen, no se copia aquí
# Esto permite hot-reload automático

EXPOSE 3000

# Comando de desarrollo con hot-reload usando nodemon (más confiable en Docker)
CMD ["sh", "-c", "npm install pg && npm run start:docker"]