import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definimos la forma de nuestro Usuario y del Contexto
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 2. Creamos el contexto
const AuthContext = createContext<AuthContextType>(null!);

// 3. 👈 ¡ESTA ES LA LÍNEA IMPORTANTE! 
// Debe tener "export" para que Login.tsx pueda importarla.
export const useAuth = () => {
  return useContext(AuthContext);
};

// 4. El Proveedor que envolverá tu App
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializar desde localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage:', error);
      return null;
    }
  });

  // Guardar en localStorage cuando user cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData: User) => {
    console.log('👤 Usuario logueado:', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('👋 Cerrando sesión');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};