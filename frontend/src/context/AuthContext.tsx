import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // Aquí podrías guardar en localStorage si quisieras persistencia
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};