"use client";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { RefreshCcw, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@heroui/table";
import { useEffect, useState } from "react";
import axios from "axios";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import UserModal from "@/components/userModal";
import ConfirmationModal from "@/components/confirmationModal";
import { useAuth } from "@/context/AuthContext";
import { addToast } from "@heroui/toast";

// Defina a interface Data
interface Data {
  id: number;
  username: string;
  email: string;
  password: string;
  // Outras propriedades
}

interface User {
  username: string;
  email: string;
  password: string;
}

export default function UsersPage() {
  const [data, setData] = useState<Data[]>([]); // Define o tipo de data como Data[]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Data | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { logout } = useAuth();

  // Estado para armazenar o token
  const [token, setToken] = useState<string | null>(null);

  // Acessa o localStorage apenas no lado do cliente
  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    setToken(storedToken);
  }, []);

  const getData = async () => {
    if (!token) return; // Se não houver token, não faz a requisição

    try {
      const response = await axios.get(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data); // Atualiza o estado com os dados
    } catch (err) {
      logout();
      addToast({
        title: "Erro ao carregar os dados",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: "danger",
      });
    }
  };

  // Busca todos os usuários
  useEffect(() => {
    if (token) {
      getData(); // Chama a função para buscar os dados
    }
  }, [token]);

  // Colunas da tabela
  const columns = [
    { key: "id", label: "ID" },
    { key: "username", label: "Usuário" },
    { key: "email", label: "Email" },
    { key: "actions", label: "Ações" },
  ];

  const handleOpenModal = (userToEdit: Data | null) => {
    setCurrentUser(userToEdit); // Define o pedido em edição (ou null para criar um novo)
    setIsModalOpen(true); // Abre o modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Função para editar/salvar users
  const handleSubmitOrder = async (userData: User) => {
    try {
      // Cria um novo usuário
      const response = await axios.post(`${apiUrl}/users/register`, userData);

      setData((prevUsers) => [
        ...prevUsers,
        { ...response.data, id: response.data.id },
      ]); // Adiciona o novo usuário ao estado
    } catch (err) {
      setErro("Erro ao criar o usuário");
    } finally {
      handleCloseModal(); // Fecha o modal após salvar
    }
  };

  const handleDeleteUser = (id: number) => {
    setUserToDeleteId(id); // Armazena o ID do pedido a ser excluído
    setIsConfirmationModalOpen(true); // Abre o modal de confirmação
  };

  const handleConfirmDelete = async () => {
    if (!userToDeleteId || !token) return; // Se não houver ID ou token, cancela

    setLoading(true); // Ativa o indicador de carregamento

    try {
      await axios.delete(`${apiUrl}/users/${userToDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Atualiza a lista de pedidos após a exclusão
      setData((prevData) =>
        prevData.filter((user) => user.id !== userToDeleteId),
      );
    } catch (_err) {
      setErro("Erro ao deletar o pedido"); // Trata o erro
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
      setIsConfirmationModalOpen(false); // Fecha o modal
      setUserToDeleteId(null); // Limpa o ID do pedido
    }
  };

  return (
    <ProtectedRoute>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card className="flex flex-row justify-between w-full px-4 py-2 bg-transparent shadow-none">
          <h1 className="flex font-bold text-3xl justify-center items-center">
            Usuários
          </h1>
          <div className="flex gap-2">
            <Button
              isIconOnly
              aria-label="Like"
              className="rounded-md"
              color="primary"
              onPress={() => getData()}
            >
              <RefreshCcw size={20} />
            </Button>
            <Button
              className="bg-primary text-white px-4 py-2 rounded-md"
              onPress={() => handleOpenModal(null)}
            >
              Criar Usuário
            </Button>
          </div>
        </Card>
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"Nenhum Usuário "} items={data}>
            {data.map((e) => (
              <TableRow key={e.id}>
                {(columnKey) =>
                  columnKey === "actions" ? (
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteUser(e.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell>{getKeyValue(e, columnKey)}</TableCell>
                  )
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <UserModal
          isOpen={isModalOpen}
          order={currentUser} // Passa o pedido para edição (ou null para criar um novo)
          onClose={handleCloseModal}
          onSubmit={handleSubmitOrder}
        />
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          message="Tem certeza que deseja deletar este usuário?"
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </section>
    </ProtectedRoute>
  );
}
