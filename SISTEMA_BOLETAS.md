# Sistema de Boletas - Documentación

## 📋 Descripción

Sistema completo de generación y visualización de boletas/facturas para la tienda de videojuegos. Incluye backend (API REST) y frontend (React).

## 🗄️ Estructura de Base de Datos

### Tabla: `boletas`
```sql
- id (PK, auto-increment)
- usuario_id (FK -> usuarios)
- total (decimal 10,2)
- estado (string: 'pendiente', 'pagada', 'cancelada')
- fecha_creacion (timestamp)
- fecha_pago (timestamp, nullable)
- metodo_pago (string, nullable)
```

### Tabla: `detalles_boleta`
```sql
- id (PK, auto-increment)
- boleta_id (FK -> boletas)
- videojuego_id (FK -> videojuegos)
- nombre_producto (string)
- precio_unitario (decimal 10,2)
- cantidad (integer)
- subtotal (decimal 10,2)
```

## 🔌 API Endpoints

### Backend (NestJS)

#### 1. Crear Boleta
```http
POST /boletas
Content-Type: application/json

{
  "usuario_id": 1,
  "items": [
    {
      "id": 123,        // IGDB game ID
      "name": "God of War",
      "price": 59.99,
      "quantity": 1
    }
  ]
}
```

#### 2. Obtener Boleta por ID
```http
GET /boletas/:id
```

#### 3. Obtener Boletas de un Usuario
```http
GET /boletas/usuario/:usuarioId
```

#### 4. Marcar como Pagada
```http
PATCH /boletas/:id/pagar
Content-Type: application/json

{
  "metodo_pago": "tarjeta"
}
```

#### 5. Cancelar Boleta
```http
PATCH /boletas/:id/cancelar
```

#### 6. Obtener Todas las Boletas (Admin)
```http
GET /boletas
```

## 🎨 Frontend

### Páginas Creadas

1. **`/mis-boletas`** - Lista de todas las boletas del usuario
   - Muestra historial completo
   - Estados con badges de color
   - Botón para ver detalle de cada boleta

2. **`/boleta/:id`** - Detalle completo de una boleta
   - Diseño tipo factura profesional
   - Botón de imprimir
   - Info del cliente
   - Lista de productos
   - Total destacado

### Navegación

- Nuevo enlace "Mis Boletas" en el navbar (solo para usuarios logueados)
- Accesible desde cualquier parte de la aplicación

## 🚀 Uso desde el Carrito

Para integrar con el carrito existente, en el componente `Carrito.tsx`, al finalizar la compra:

```typescript
const handleCheckout = async () => {
  try {
    const response = await fetch('http://localhost:3000/boletas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario_id: user.id,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        }))
      })
    });

    const boleta = await response.json();
    
    // Redirigir a la boleta creada
    navigate(`/boleta/${boleta.id}`);
    
    // Limpiar carrito
    clearCart();
  } catch (error) {
    console.error('Error al crear boleta:', error);
  }
};
```

## ✨ Características

- ✅ Creación automática de tablas con TypeORM
- ✅ Relaciones entre entidades (Usuario, Boleta, DetallesBoleta, Videojuego)
- ✅ Estados de boleta (pendiente, pagada, cancelada)
- ✅ Historial completo por usuario
- ✅ Diseño responsive
- ✅ Impresión de boletas
- ✅ Validaciones de datos
- ✅ Manejo de errores

## 🔧 Instalación

Las tablas se crearán automáticamente cuando inicies el backend porque tienes `synchronize: true` en TypeORM.

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 Notas

- Las tablas se crean automáticamente en Neon PostgreSQL
- `synchronize: true` debe estar desactivado en producción
- Usa migraciones para producción
- El estado inicial de toda boleta es "pendiente"
- Los nombres de productos se guardan para mantener historial aunque se elimine el juego

## 🎯 Próximos Pasos Sugeridos

1. Integrar con el componente Carrito para crear boletas al finalizar compra
2. Agregar pasarela de pago real (Stripe, PayPal)
3. Enviar email con la boleta al usuario
4. Exportar boletas a PDF
5. Dashboard admin para ver todas las ventas
