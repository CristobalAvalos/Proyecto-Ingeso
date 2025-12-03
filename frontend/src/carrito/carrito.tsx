import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Carrito: React.FC = () => {
  // 👈 ACTUALIZADO: Traemos clearCart del contexto
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const [status, setStatus] = useState<'cart' | 'loading' | 'success'>('cart');
  
  // Estado para el recibo final
  const [orderSummary, setOrderSummary] = useState<{ items: typeof cartItems, total: number } | null>(null);

  // Cálculos matemáticos
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  // Lógica de pago
  const handlePayment = () => {
    setStatus('loading'); // 1. UI de carga

    // 2. Simulamos la espera de la pasarela de pago
    setTimeout(() => {
      // A. Guardamos la "foto" del carrito actual para mostrar el recibo
      // (Es importante hacer esto ANTES de vaciar el carrito)
      setOrderSummary({
        items: [...cartItems],
        total: total
      });

      // B. 👈 AQUÍ VACIAMOS EL CARRITO GLOBAL
      clearCart(); 

      // C. Cambiamos a la vista de éxito
      setStatus('success'); 
    }, 2500);
  };

  // -------------------------------------------------------------------
  // VISTA 1: CARGANDO
  // -------------------------------------------------------------------
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-pulse">
          Procesando tu pago...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Por favor no cierres esta ventana.</p>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // VISTA 2: ÉXITO (RECIBO)
  // -------------------------------------------------------------------
  if (status === 'success' && orderSummary) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Cabecera */}
          <div className="bg-green-600 p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">¡Pago Exitoso!</h2>
          </div>

          {/* Cuerpo del Recibo */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen de la compra</h3>
            
            <div className="space-y-4 mb-6">
              {orderSummary.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                  <div className="flex items-center">
                    <img 
                      src={item.coverUrl || 'https://placehold.co/64x64'} 
                      alt={item.name} 
                      className="w-12 h-12 rounded object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className=" border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total Pagado:</span>
                <span className="text-2xl font-bold text-white">${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/" 
              className="block w-full text-center bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded transition duration-150"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // VISTA 3: CARRITO VACÍO
  // -------------------------------------------------------------------
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tu Carrito está vacío
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Parece que no has añadido ningún juego todavía.
          </p>
          <Link 
            to="/" 
            className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-lg px-6 py-3 transition duration-150"
          >
            ← Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // VISTA 4: LISTA DE ITEMS (ESTADO NORMAL)
  // -------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tu Carrito de Compras
          </h1>
          <Link to="/" className="text-white hover:text-indigo-500 font-medium flex items-center transition duration-150">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Catálogo
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda */}
          <div className="lg:w-2/3 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Artículos ({cartItems.length})</h2>
            
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-center">
                  <img 
                    src={item.coverUrl || 'https://placehold.co/64x64/334155/ffffff?text=?'} 
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover mr-4 bg-gray-200 dark:bg-gray-700"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 text-sm font-medium mt-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Columna Derecha */}
          <div className="lg:w-1/3 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Resumen del Pedido</h2>
            
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
              <span className="text-lg font-bold "> ${total.toFixed(2)}</span>

              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                
              </div>
            </div>

            <button
              onClick={handlePayment} 
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