import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from "./login/Login";
import Catalogo from './catalogo/catalogo';
import Carrito from './carrito/carrito';

// Componente de navegación para control de visibilidad
function NavBar() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (

    <nav className="flex justify-between items-center p-4 bg-black text-white">

      <div>
        <Link to="/" className="text-white text-lg font-semibold hover:text-gray-300 transition duration-150">
          Catálogo
        </Link>
      </div>


      <div className="flex items-center space-x-4">    
        {/* Icono de carro*/}
        <Link to="/carrito" className="p-1 rounded-full hover:bg-gray-700 transition duration-150" aria-label="Ir al Carrito de Compras">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-11">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>

        </Link>
        
        {/* Icono de usuario */}
        <Link to="/login" className="p-1 rounded-full hover:bg-gray-700 transition duration-150" aria-label="Ir a Inicio de Sesión">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-11">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>

        </Link>
        
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* La barra de navegación se muestra condicionalmente */}
      <NavBar />
      
      <Routes>
        {/* Catálogo es la página principal */}
        <Route path="/" element={<Catalogo />} />
        
        {/* Ruta para el Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para el Carrito */}
        <Route path="/carrito" element={<Carrito />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
