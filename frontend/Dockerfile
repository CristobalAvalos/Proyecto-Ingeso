# Dockerfile para desarrollo con hot-reload
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Ejecutar Vite en modo desarrollo (sin --open para Docker)
CMD ["npm", "run", "dev:docker"]