"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Importa o axios

import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Usa a função de login do contexto
  const router = useRouter();

  const handleLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      // Faz a requisição para a API de login do NestJS usando axios
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        const { access_token } = response.data; // Extrai o token do objeto de resposta

        login(access_token); // Autentica o usuário com o token
        router.push("/"); // Redireciona para a página protegida
      } else {
        alert("Credenciais inválidas.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Ocorreu um erro ao tentar fazer login.",
        );
      } else {
        alert("Ocorreu um erro ao tentar fazer login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginForm isLoading={isLoading} onSubmit={handleLogin} />;
}
