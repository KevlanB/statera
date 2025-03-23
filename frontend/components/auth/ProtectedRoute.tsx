"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Adicionamos isLoading
  const router = useRouter();

  useEffect(() => {
    // Só redireciona se o contexto já foi carregado e o usuário não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Exibe um indicador de carregamento enquanto o contexto é carregado
  if (isLoading) {
    return <p />; // Ou um spinner de carregamento
  }

  // Se o usuário estiver autenticado, renderiza o conteúdo da página
  return isAuthenticated ? <>{children}</> : null;
};
