# Dockerfile para desarrollo con hot-reload
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluye devDependencies)
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Ejecutar Vite en modo desarrollo
CMD ["npm", "run", "dev:docker"]
