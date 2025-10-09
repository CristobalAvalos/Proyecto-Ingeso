import React from "react";
import { Link } from "react-router-dom";

// Componente principal del Carrito de Compras
const Carrito: React.FC = () => {
  // Datos de ejemplo para el carrito
  const items = [
    { id: 1, name: "silson", price: 59.99, quantity: 1 },
    { id: 2, name: "jolou nai", price: 49.99, quantity: 1 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado y botón de Regreso */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tu Carrito de Compras
          </h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center transition duration-150">
            {/* Ícono de flecha hacia atrás (Lucide) */}
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Catálogo
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Columna Izquierda: Lista de Artículos */}
          <div className="lg:w-2/3 bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Artículos ({items.length})</h2>
            
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mr-4">
                    <span className="text-2xl" role="img" aria-label="product icon">🎮</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.price.toFixed(2)} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className="lg:w-1/3 bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Resumen del Pedido</h2>
            
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                <span className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-md shadow-md hover:bg-indigo-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
