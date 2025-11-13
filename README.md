# 🎮 Catálogo de Videojuegos - IGDB

Un catálogo web moderno para explorar y descubrir videojuegos usando la API de IGDB. El proyecto muestra los 500 juegos más populares con la posibilidad de filtrarlos por género.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 📝 Descripción

Este proyecto surgió como una forma de explorar videojuegos de manera visual e intuitiva. Utiliza la API de IGDB (Internet Game Database) para obtener información actualizada sobre los juegos más populares del momento.

La aplicación permite:
- Ver un catálogo de 500 juegos ordenados por popularidad
- Filtrar juegos por género (acción, RPG, shooter, estrategia, etc.)
- Ver detalles de cada juego como portada, géneros, plataformas y rating
- Diseño responsive que funciona en móvil, tablet y desktop

## ✨ Características

- 🏆 **Top 500 Juegos Populares** - Basado en datos reales de popularidad de IGDB
- 🎯 **Filtrado por Género** - 11 géneros disponibles para filtrar
- 📱 **Diseño Responsive** - Mobile-first con Tailwind CSS
- ⚡ **API REST** - Backend en NestJS con TypeScript
- 🐳 **Docker** - Todo containerizado para fácil deployment
- 💾 **Base de Datos** - PostgreSQL con TypeORM
- 🔄 **Hot Reload** - Desarrollo con nodemon y Vite

## 🚀 Tecnologías

### Backend
- **NestJS 11** - Framework progresivo de Node.js
- **TypeScript 5.7** - Tipado estático
- **TypeORM 0.3** - ORM para PostgreSQL
- **Axios** - Cliente HTTP para consumir IGDB API
- **@nestjs/config** - Manejo de variables de entorno

### Frontend
- **React 19** - Librería UI con hooks
- **TypeScript** - Tipado estático en el frontend
- **Vite 7** - Build tool ultra rápido
- **Tailwind CSS 3** - Estilos utility-first
- **React Router DOM** - Navegación

### Infrastructure
- **Docker & Docker Compose** - Containerización
- **PostgreSQL 16** - Base de datos relacional
- **Nodemon** - Auto-restart en desarrollo

## 📦 Instalación

### Prerrequisitos

Necesitas tener instalado:
- Docker Desktop
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/CristobalAvalos/Proyecto-Ingeso.git
cd Proyecto-Ingeso
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```bash
cd backend
```

Crea el archivo `.env` con el siguiente contenido:

```env
# IGDB API Credentials
IGDB_CLIENT_ID=tu_client_id_aqui
IGDB_ACCESS_TOKEN=tu_access_token_aqui

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🎯 Endpoints de la API

### Obtener catálogo general
```
GET http://localhost:3000/catalogo
```

### Obtener Top 500 más populares
```
GET http://localhost:3000/catalogo/top500
```
Retorna los 500 juegos más populares basados en datos de popularidad

### Filtrar por género
```
GET http://localhost:3000/catalogo/genero/:genero
```
Retorna juegos filtrados por género del top 500

**Ejemplo:**
```bash
curl http://localhost:3000/catalogo/genero/rpg
```

## 📂 Estructura del Proyecto

```
Proyecto-Ingeso/
├── backend/                    # API Backend en NestJS
│   ├── src/
│   │   ├── catalogoModule/     # Módulo principal del catálogo
│   │   │   ├── catalogo.controller.ts  # Endpoints REST
│   │   │   ├── catalogo.service.ts     # Lógica de negocio
│   │   │   ├── catalogo.module.ts      # Configuración módulo
│   │   │   └── entities/
│   │   │       └── videojuego.entity.ts # Entidad TypeORM
│   │   ├── app.module.ts       # Módulo raíz
│   │   └── main.ts             # Entry point
│   ├── .env                    # Variables de entorno (NO COMMITEAR)
│   ├── Dockerfile
│   ├── nodemon.json            # Config auto-reload
│   └── package.json
│
├── frontend/                   # App React
│   ├── src/
│   │   ├── catalogo/
│   │   │   └── catalogo.tsx    # Componente principal
│   │   ├── carrito/
│   │   │   └── carrito.tsx     # Carrito de compras
│   │   ├── login/
│   │   │   └── Login.tsx       # Login component
│   │   ├── App.tsx             # App root
│   │   └── main.tsx            # Entry point
│   ├── Dockerfile
│   ├── tailwind.config.js      # Config Tailwind
│   ├── vite.config.js          # Config Vite
│   └── package.json
│
├── docker-compose.yml          # Orquestación contenedores
├── package.json                # Dependencias raíz
└── README.md                   # Este archivo
```

## 🔧 Comandos Útiles

### Docker

```bash
# Primera vez - construir e iniciar
docker-compose up --build

# Iniciar el proyecto
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Detener contenedores
docker-compose down

# Ver logs del backend
docker-compose logs -f backend

# Ver logs del frontend
docker-compose logs -f frontend

# Entrar al contenedor del backend
docker exec -it nest-backend sh

# Reiniciar un servicio específico
docker-compose restart backend
```