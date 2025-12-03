import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // Estado para el checkbox
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Petición al Backend NestJS
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // 2. Guardar usuario en el contexto global
      login(data.user);

      // 3. Lógica de Redirección según ROL
      if (data.user.rol === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/'); 
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    // 👇 CAMBIO 1: Altura calculada para evitar scrollbar (100vh - altura aprox del nav)
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] bg-gray-100 dark:bg-gray-900">
      
      {/* 👇 CAMBIO 2: 'mb-32' para subir la tarjeta visualmente */}
      <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-32">
        
        <div className="text-center">
          {/* Logo del control (Opcional, ya que tienes la barra arriba, pero lo dejo por diseño) */}
          <Link to="/"> 
            <img
              className="h-14 w-auto mx-auto cursor-pointer hover:opacity-80 transition" 
              src="https://www.svgrepo.com/show/352066/gamepad.svg"
              alt="Volver al catalogo" 
            />
          </Link>
          
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Iniciar Sesión
          </h2>

        </div>

        {/* Mensaje de Error */}
        {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm border-gray-300 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm border-gray-300 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;