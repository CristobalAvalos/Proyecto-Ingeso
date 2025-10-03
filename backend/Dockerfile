#build
FROM node:20-alpine AS dev-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# run
FROM node:20-alpine
WORKDIR /app
COPY --from=dev-build /app/package*.json ./
RUN npm install --only=production && npm cache clean --force
COPY --from=dev-build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]