"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { fetchApi } from "@/services/fetchApi";

interface NewCustomer {
  name: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
}

interface CreateCustomerDialogProps {
    onCreate: () => void;
}

const CreateCustomerDialog: React.FC<CreateCustomerDialogProps> = ({ onCreate }) => {
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$|^\(\d{2}\) \d{4}-\d{4}$/;

  function formatPhone(value: string) {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleaned.length <= 10
      ? cleaned.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
      : cleaned;
  }

  function validateFields() {
    const newErrors = {
      name: !newCustomer.name,
      email: !newCustomer.email || !emailRegex.test(newCustomer.email),
      phone: !newCustomer.phone || !phoneRegex.test(newCustomer.phone),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }

  async function handleCreate() {
    if (!validateFields()) {
      return;
    }
  
    try {
      const response = await fetchApi("/customers", {
        method: "POST",
        body: JSON.stringify({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          street: newCustomer.street,
          number: newCustomer.number,
          district: newCustomer.district,
          city: newCustomer.city,
          state: newCustomer.state,
          creditBalance: 0,
        }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Erro ao criar cliente");
      }
  
      onCreate();

      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
      });
      setErrors({ name: false, email: false, phone: false });
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  }  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-21 sm:w-auto p-2 text-center">Cadastrar Cliente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs">Campo obrigatório</p>}

          <Input
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs">Campo obrigatório</p>}

          <Input
            placeholder="Telefone (ex: (XX) XXXXX-XXXX)"
            value={newCustomer.phone}
            onChange={(e) => {
              const formattedPhone = formatPhone(e.target.value);
              setNewCustomer({ ...newCustomer, phone: formattedPhone });
            }}
            maxLength={15}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-xs">Campo inválido</p>}

          <Input
            placeholder="Rua"
            value={newCustomer.street}
            onChange={(e) => setNewCustomer({ ...newCustomer, street: e.target.value })}
          />
          <Input
            placeholder="Número"
            value={newCustomer.number}
            onChange={(e) => setNewCustomer({ ...newCustomer, number: e.target.value })}
          />
          <Input
            placeholder="Bairro"
            value={newCustomer.district}
            onChange={(e) => setNewCustomer({ ...newCustomer, district: e.target.value })}
          />
          <Input
            placeholder="Cidade"
            value={newCustomer.city}
            onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
          />
          <Input
            placeholder="Estado"
            value={newCustomer.state}
            onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerDialog;
