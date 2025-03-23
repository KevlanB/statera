"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Eye, EyeClosed } from "lucide-react";

type LoginFormProps = {
  onSubmit: (credentials: { username: string; password: string }) => void;
  isLoading: boolean;
};

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [viewPass, setViewPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password }); // Chama a função de login passada como prop
  };

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl text-default-700 font-bold">Gestão de pedidos</h1>
      <h1 className="text-md text-default-500">
        Entre com usuário e senha para continuar
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          required
          label="Usuário"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          required
          endContent={
            <Button
              isIconOnly
              className="my-auto text-default-800 bg-transparent rounded-full"
              onPress={() => setViewPass(!viewPass)}
            >
              {viewPass ? <Eye /> : <EyeClosed />}
            </Button>
          }
          label="Senha"
          type={viewPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth color="primary" isLoading={isLoading} type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
};
