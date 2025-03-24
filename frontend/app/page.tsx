"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Edit, Trash2, RefreshCcw, SquareChartGantt } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";

import OrderModal from "@/components/orderModal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ConfirmationModal from "@/components/confirmationModal";
import ItemModal from "@/components/itemModal";
import { useAuth } from "@/context/AuthContext";

function HomeContent() {
  // Estados (Hooks)
  const [data, setData] = useState<Data[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Data | null>(null);

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState<number | null>(null);

  const [currentItem, setCurrentItem] = useState<Data | null>(null);
  const [isModalOpenItem, setIsModalOpenItem] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const status = searchParams.get("status");

  const { logout } = useAuth();

  useEffect(() => {
    if (id) {
      const numberId = Number(id); // Converte o `id` para número

      if (status === "canceled") {
        // Exibe um toast de erro
        addToast({
          title: "Erro no pagamento",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "danger",
        });
      } else {
        // Exibe um toast de sucesso

        addToast({
          title: "Pagamento realizado!",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "success",
        });

        // Atualiza o status do pedido no backend
        axios
          .put(`${apiUrl}/orders/${numberId}`, { status: "pago" })
          .then(() => {
            // Atualiza o estado `data` com o novo status
            setData((prevOrders) =>
              prevOrders.map((order) =>
                order.id === numberId ? { ...order, status: "pago" } : order,
              ),
            );
          })
          .catch(() => {
            // Exibe um toast de erro
            addToast({
              title: "Erro ao atualizar o pedido",
              timeout: 3000,
              shouldShowTimeoutProgress: true,
              color: "danger",
            });
          });
      }
    }
  }, [id, status, addToast, apiUrl, setData]);

  // Busca os dados quando o componente é montado e o usuário está autenticado
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/orders`);

        setData(response.data); // Atualiza o estado com os dados
      } catch (_err) {
        logout();
      }
    };

    getData(); // Chama a função para buscar os dados
  }, []);

  // Colunas da tabela
  const columns = [
    { key: "id", label: "ID" },
    { key: "client", label: "Cliente" },
    { key: "total", label: "Total (R$)" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Ações" },
  ];

  interface Item {
    name: string;
    price: number;
    quantity: number;
  }

  // Interface para os dados dos pedidos
  interface Data {
    id: number;
    client: string;
    items: Item[];
    total: number;
    status: "pendente" | "pago" | "cancelado";
  }

  interface Order {
    id?: string;
    client: string;
    items: Item[];
    total: number;
    status: "pendente" | "pago" | "cancelado";
  }

  // Função de conversão
  const convertDataToOrder = (data: Data | null): Order | null => {
    if (!data) return null;

    return {
      id: data.id.toString(), // Converte o ID de number para string
      client: data.client,
      items: data.items,
      total: data.total,
      status: data.status as "pendente" | "pago" | "cancelado", // Garante que o status seja válido
    };
  };

  // Mapeamento de cores para os status
  const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
    pago: "success",
    cancelado: "danger",
    pendente: "warning",
  };

  // Função para abrir o modal de edição de pedidos
  const handleOpenModal = (orderToEdit: Data | null) => {
    setCurrentOrder(orderToEdit); // Define o pedido em edição (ou null para criar um novo)
    setIsModalOpen(true); // Abre o modal
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteOrder = (id: number) => {
    setOrderToDeleteId(id); // Armazena o ID do pedido a ser excluído
    setIsConfirmationModalOpen(true); // Abre o modal de confirmação
  };

  const handleConfirmDelete = async () => {
    if (!orderToDeleteId) return; // Se não houver ID, cancela

    try {
      await axios.delete(`${apiUrl}/orders/${orderToDeleteId}`);

      // Atualiza a lista de pedidos após a exclusão
      setData((prevData) =>
        prevData.filter((order) => order.id !== orderToDeleteId),
      );
    } catch (_err) {
      addToast({
        title: "Erro ao deletar o pedido",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: "danger",
      });
    } finally {
      setIsConfirmationModalOpen(false); // Fecha o modal
      setOrderToDeleteId(null); // Limpa o ID do pedido
    }
  };

  // Função para editar/salvar pedidos
  const handleSubmitOrder = async (orderData: any) => {
    if (orderData.id) {
      // Edita um pedido existente
      await axios
        .put(`${apiUrl}/orders/${orderData.id}`, orderData)
        .then(() => {
          setData((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderData.id ? { ...order, ...orderData } : order,
            ),
          );
        })
        .catch((err) => {
          addToast({
            title: "Erro ao editar o pedido",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            color: "danger",
          });
        });
    } else {
      // Cria um novo pedido
      await axios
        .post(`${apiUrl}/orders`, orderData)
        .then((response) => {
          setData((prevOrders) => [...prevOrders, response.data]);
        })
        .catch((err) => {
          addToast({
            title: "Erro ao criar o pedido",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            color: "danger",
          });
        });
    }
    handleCloseModal(); // Fecha o modal após salvar
  };

  const handleOpenModalDetails = (items: Data | null) => {
    setCurrentItem(items); // Define o pedido em edição (ou null para criar um novo)
    setIsModalOpenItem(true); // Abre o modal
  };

  const handleCloseModalItem = () => {
    setIsModalOpenItem(false);
  };

  const handleSubmitItem = async (itemData: any) => {
    // Cria um pagamento
    const items = itemData.items;
    const id = itemData.id;

    try {
      // 1. Prepara os itens para o Stripe
      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: "brl", // Moeda (BRL para reais)
          product_data: {
            name: item.name, // Nome do produto
          },
          unit_amount: item.price, // Preço em centavos
        },
        quantity: item.quantity, // Quantidade
      }));

      // 2. Envia os itens para o backend usando Axios
      const response = await axios.post(`${apiUrl}/stripe/create-checkout`, {
        lineItems,
        id,
      });

      // 3. Redireciona para o checkout do Stripe
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
    } finally {
      handleCloseModal(); // Fecha o modal após salvar
    }
  };

  return (
    <ProtectedRoute>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card className="flex flex-row justify-between w-full px-4 py-2 bg-transparent shadow-none">
          <h1 className="flex font-bold text-3xl justify-center items-center">
            Pedidos
          </h1>
          <div className="flex gap-2">
            <Button
              isIconOnly
              aria-label="Like"
              className="rounded-md"
              color="primary"
            >
              <RefreshCcw size={20} />
            </Button>
            <Link passHref href="/createOrder">
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                Criar Pedido
              </button>
            </Link>
          </div>
        </Card>
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"Nenhum Pedido"} items={data}>
            {data.map((e) => (
              <TableRow key={e.id}>
                {(columnKey) =>
                  columnKey === "status" ? (
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={statusColorMap[e.status]}
                        size="sm"
                        variant="flat"
                      >
                        {e.status}
                      </Chip>
                    </TableCell>
                  ) : columnKey === "actions" ? (
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          className=" hover:text-primary"
                          onClick={() => handleOpenModalDetails(e)}
                        >
                          <SquareChartGantt
                            className={
                              e.status === "pendente"
                                ? "text-success-500"
                                : "text-default-700"
                            }
                            size={18}
                          />
                        </button>
                        <button
                          className=" hover:text-primary"
                          onClick={() => handleOpenModal(e)}
                        >
                          <Edit className="text-default-700" size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteOrder(e.id)}
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

        <OrderModal
          isOpen={isModalOpen}
          order={convertDataToOrder(currentOrder)} // Converte `Data` para `Order`
          onClose={handleCloseModal}
          onSubmit={handleSubmitOrder}
        />

        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          message="Tem certeza que deseja deletar este pedido?"
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        <ItemModal
          isOpen={isModalOpenItem}
          item={convertDataToOrder(currentItem)} // Passa o pedido para edição (ou null para criar um novo)
          onClose={handleCloseModalItem}
          onSubmit={handleSubmitItem}
        />
      </section>
    </ProtectedRoute>
  );
}

export default function Home(): JSX.Element {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
