"use client";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Divider } from "@heroui/divider";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { addToast } from "@heroui/toast";

export default function CreateOrderPage() {
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("pendente");
  const [total, setTotal] = useState("0.00");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0.0 }]);

  // Errors
  const [clientError, setClientError] = useState(false);
  const [clientErrorMsg, setClientErrorMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  type Item = {
    name: string;
    quantity: number;
    price: number;
  };

  const statusOptions = [
    { key: "pendente", label: "Pendente" },
    { key: "pago", label: "Pago" },
    { key: "cancelado", label: "Cancelado" },
  ];

  // Add items new line
  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  // Delete item line
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);

    setItems(newItems);
  };

  // Update one line field
  const updateItem = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) => {
    const newItems = [...items];

    newItems[index][field] = value as never; // Coloquei "as never" para evitar erros de tipagem
    setItems(newItems);
  };

  // Total items calculator function
  const calculateTotal = () => {
    const total = items.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);

    setTotal(total.toFixed(2)); // Format two decimals
  };

  // Updates the total whenever items change
  useEffect(() => {
    calculateTotal();
  }, [items]);

  const validateFields = () => {
    const newErrors: string[] = [];

    // Verifica se o campo "client" está preenchido
    if (!client.trim()) {
      setClientError(true);
      setClientErrorMsg("Campo cliente obrigatório");
      newErrors.push("Campo cliente obrigatório");
    }

    // Verifica se há pelo menos um item
    if (items.length === 0) {
      addToast({
        title: "Adicione pelo menos um item.",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: "danger",
      });
      newErrors.push("Adicione pelo menos um item.");
    }

    // Verifica se todos os itens estão preenchidos corretamente
    items.forEach((item, index) => {
      if (!item.name.trim()) {
        addToast({
          title: `O campo Produto do item ${index + 1} é obrigatório.`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "danger",
        });
        newErrors.push(`O campo Produto do item ${index + 1} é obrigatório.`);
      }
      if (item.quantity <= 0) {
        addToast({
          title: `A quantidade do item ${index + 1} deve ser maior que zero.`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "danger",
        });
        newErrors.push(
          `A quantidade do item ${index + 1} deve ser maior que zero.`,
        );
      }
      if (item.price <= 0) {
        addToast({
          title: `O preço do item ${index + 1} deve ser maior que zero.`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "danger",
        });
        newErrors.push(`O preço do item ${index + 1} deve ser maior que zero.`);
      }
    });

    // Retorna true se não houver erros
    return newErrors.length === 0;
  };

  const cleanFields = () => {
    setClient("");
    setItems([{ name: "", quantity: 1, price: 0.0 }]);
    setTotal("0.00");
    setStatus("pendente");
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return; // Impede o envio se houver erros
    }
    const data = {
      client,
      items,
      total,
      status,
    };

    await axios
      .post(`${apiUrl}/orders`, data)
      .then(() => {
        cleanFields();
        addToast({
          title: "Pedido Salvo!",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "success",
        });
      })
      .catch(() => {
        addToast({
          title: "Erro ao salvar o pedido",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "success",
        });
      });
  };

  const changeClient = (e: any) => {
    setClientError(false);
    setClient(e.target.value);
  };

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <Breadcrumbs className="absolute top-0 left-10">
        <BreadcrumbItem href="/">Início</BreadcrumbItem>
        <BreadcrumbItem>Criar Pedido</BreadcrumbItem>
      </Breadcrumbs>

      {/* orders field */}
      <div className="flex gap-2 mb-4">
        <Input
          errorMessage={clientErrorMsg}
          isInvalid={clientError}
          label="Cliente"
          type="text"
          value={client}
          onChange={changeClient}
        />
        <Select
          label="Status"
          selectedKeys={[status]}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statusOptions.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>
        <Input
          readOnly
          label="Total (R$)"
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
      </div>

      <Divider className="my-4" />

      {/* items list */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold mx-2 mt-20">Itens</h1>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              label="Produto"
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
            />
            <Input
              className="w-1/2"
              label="Quantidade"
              type="number"
              value={item.quantity.toString()}
              onChange={(e) =>
                updateItem(index, "quantity", Number(e.target.value))
              }
            />
            <Input
              className="w-1/2"
              label="Preço unit. (R$)"
              type="number"
              value={item.price.toString()}
              onChange={(e) =>
                updateItem(index, "price", Number(e.target.value))
              }
            />
            <Button
              isIconOnly
              className="bg-transparent"
              onPress={() => removeItem(index)}
            >
              <Trash2 className="text-red-500" />
            </Button>
          </div>
        ))}
        <div className="flex justify-between">
          <Button
            className="mt-4"
            color="primary"
            startContent={<PlusCircle />}
            onPress={addItem}
          >
            Adicionar Item
          </Button>
          <Button
            className="mt-4"
            color="primary"
            startContent={<Save />}
            onPress={handleSave}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
