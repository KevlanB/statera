import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id?: string; // ID é opcional (pode não existir em um novo pedido)
  client: string;
  items: Item[];
  status: "pendente" | "pago" | "cancelado";
}

interface OrderModalProps {
  isOpen: boolean; // Indica se o modal está aberto
  onClose: () => void; // Função para fechar o modal
  order: Order | null; // Dados do pedido (pode ser nulo)
  onSubmit: (order: Order) => void; // Função para submeter o pedido
}

const OrderModal = ({ isOpen, onClose, order, onSubmit }: OrderModalProps) => {
  const [client, setClient] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<"pendente" | "pago" | "cancelado">(
    "pendente",
  );

  // Updates states whenever `order` changes
  useEffect(() => {
    if (order) {
      setClient(order.client || "");
      setItems(order.items || []);
      setStatus(order.status || "pendente");
    } else {
      // If there is no order, reset the states (creation mode)
      setClient("");
      setItems([]);
      setStatus("pendente");
    }
  }, [order]); // Dependência: `order`

  const handleSubmit = () => {
    onSubmit({
      id: order?.id, // Keep ID if editing
      client,
      items,
      status,
    });
    onClose();
  };

  if (!isOpen) return null;

  const statusOptions = [
    { key: "pendente", label: "Pendente" },
    { key: "pago", label: "Pago" },
    { key: "cancelado", label: "Cancelado" },
  ];

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2>{order ? "Editar Pedido" : "Criar Pedido"}</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Cliente"
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
              <Select
                label="Status"
                selectedKeys={[status]}
                onChange={(e) =>
                  setStatus(e.target.value as "pendente" | "pago" | "cancelado")
                }
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Salvar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default OrderModal;
