import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from "./login/login";
import Catalogo from './catalogo/catalogo';
import Carrito from './carrito/carrito';
import AdminDashboard from './admindashboard/AdminDashboard';

// Importamos los contextos
import { CartProvider, useCart } from './context/CartContext'; 
import { AuthProvider, useAuth } from './context/AuthContext';          

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { itemCount } = useCart(); 
  const { user, logout } = useAuth(); 

  // 1. 👇 Detectamos si estamos en la página de login
  const isLoginPage = location.pathname === '/login';



  const logoUrl = '/los silson.png'; 

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="flex items-center p-4 bg-black text-white">
      
      {/* SECCIÓN IZQUIERDA: Catálogo + Botón Admin */}
      <div className="flex-1 flex items-center gap-4">
        {/* 3. 👇 Solo mostramos esto si NO es login (!isLoginPage) */}
        {!isLoginPage && (
          <>
            <Link to="/" className="text-white text-lg font-semibold hover:text-gray-300 transition duration-150">
              Catálogo
            </Link>

            {/* Botón exclusivo para ADMIN */}
            {user && user.rol === 'admin' && (
              <Link 
                to="/admin-dashboard" 
                className="text-white text-lg font-semibold hover:text-gray-300 transition duration-150"
              >
              Panel Admin
              </Link>
            )}
          </>
        )}
      </div>

      {/* SECCIÓN CENTRAL: Logo (SIEMPRE VISIBLE) */}
      <div className="flex-1 flex justify-center">
        {/* Al hacer click lleva al inicio (Catálogo) */}
        <Link to="/">
          <img src={logoUrl} alt="Los Silson Logo" className="h-16" />
        </Link>
      </div>

      {/* SECCIÓN DERECHA: Carrito + Usuario */}
      <div className="flex-1 flex justify-end items-center space-x-4">    
        
        {/* 4. 👇 Solo mostramos los íconos si NO es login (!isLoginPage) */}
        {!isLoginPage && (
          <>
            {/* Carrito */}
            <Link to="/carrito" className="relative p-1 rounded-full hover:bg-gray-700 transition duration-150" title="Ver Carrito">
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </Link>
            
            {/* Lógica de Usuario / Logout */}
            {user ? (
                <div className="flex items-center gap-2">
                    <span className="hidden md:block text-sm font-medium text-gray-300">
                        {user.nombre}
                    </span>

                    <button 
                        onClick={handleLogout}
                        className="p-1 rounded-full text-red-400 hover:bg-red-900/30 transition duration-150 flex items-center gap-1"
                        title="Cerrar Sesión"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                    </button>
                </div>
            ) : (
                <Link to="/login" className="p-1 rounded-full hover:bg-gray-700 transition duration-150" title="Iniciar Sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          
          <NavBar /> 
          
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />}/>
          </Routes>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;