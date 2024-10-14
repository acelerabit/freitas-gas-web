"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import { formatPhone } from "@/utils/phoneUtils";

interface NewSupplier {
  name: string;
  email: string;
  phone: string;
}

interface CreateSupplierDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const CreateSupplierDialog: React.FC<CreateSupplierDialogProps> = ({ open, onOpenChange }) => {
  const [newSupplier, setNewSupplier] = useState<NewSupplier>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateFields() {
    const newErrors = {
      name: !newSupplier.name,
      email: !newSupplier.email || !emailRegex.test(newSupplier.email),
      phone: !newSupplier.phone || !/\(\d{2}\) \d{5}-\d{4}|\(\d{2}\) \d{4}-\d{4}/.test(newSupplier.phone),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }

  async function handleCreate() {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await fetchApi("/suppliers", {
        method: "POST",
        body: JSON.stringify({
          name: newSupplier.name,
          email: newSupplier.email,
          phone: newSupplier.phone,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao criar fornecedor");
      }

      setNewSupplier({ name: "", email: "", phone: "" });
      setErrors({ name: false, email: false, phone: false });
      onOpenChange();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Fornecedor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs">Campo obrigatório</p>}

          <Input
            placeholder="Email"
            value={newSupplier.email}
            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs">Campo obrigatório</p>}

          <Input
            placeholder="Telefone"
            value={newSupplier.phone}
            onChange={(e) => {
              const formattedPhone = formatPhone(e.target.value);
              setNewSupplier({ ...newSupplier, phone: formattedPhone });
            }}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-xs">Campo inválido</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSupplierDialog;
