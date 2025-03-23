"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean; // Novo estado para controlar o carregamento
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Novo estado para controlar o carregamento

  // Verifica se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Define que o contexto foi carregado
  }, []);

  const login = (token: string) => {
    localStorage.setItem("auth-token", token); // Armazena o token no localStorage
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth-token"); // Remove o token do localStorage
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
