import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { CircleDollarSign } from "lucide-react";

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id?: string;
  client: string;
  items: Item[];
  total: number;
  status: "pendente" | "pago" | "cancelado";
}

interface ItemModalProps {
  isOpen: boolean; // Indica se o modal está aberto
  onClose: () => void; // Função para fechar o modal
  item: Order | null; // Dados do pedido (pode ser nulo)
  onSubmit: (item: Order) => void; // Função para submeter o pedido
}

const ItemModal = ({ isOpen, onClose, item, onSubmit }: ItemModalProps) => {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    if (item?.items && Array.isArray(item.items)) {
      setData(item.items);
    } else {
      setData([]); // Define `data` como um array vazio se `item?.items` for inválido
    }
  }, [item]);

  const handleSubmit = () => {
    if (item) {
      // Verifica se `item` não é null
      onSubmit(item); // Passa `item` para a função `onSubmit`
      onClose(); // Fecha o modal
    }
  };

  if (!isOpen) return null;

  const columns = [
    { key: "name", label: "Produto" },
    { key: "price", label: "Preço (R$)" },
    { key: "quantity", label: "Qtd" },
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
              <h2>{item ? "Produtos" : "Criar Pedido"}</h2>
            </ModalHeader>
            <ModalBody>
              <Table aria-label="Example table with dynamic content">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody emptyContent={"Nenhum Item"} items={data}>
                  {data.map((e) => (
                    <TableRow key={e.name}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(e, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <h1 className="ml-4 w-full flex  font-bold text-default-700">
                Total: {item?.total}
              </h1>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              {item?.status === "pendente" && (
                <Button
                  className="text-white"
                  color="success"
                  startContent={<CircleDollarSign size={20} />}
                  onPress={handleSubmit}
                >
                  Pagar
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ItemModal;
