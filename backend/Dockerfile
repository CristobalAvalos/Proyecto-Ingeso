# Dockerfile para desarrollo con hot-reload
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluye dev dependencies para hot-reload)
RUN npm install

# El código se monta como volumen, no se copia aquí
# Esto permite hot-reload automático

EXPOSE 3000

# Comando de desarrollo con hot-reload usando nodemon (más confiable en Docker)
CMD ["npm", "run", "start:docker"]