"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import { formatPhone } from "@/utils/phoneUtils";

interface EditSupplierDialogProps {
  supplier: { id: string; name: string; email: string; phone: string };
  onUpdate: () => void;
}

const EditSupplierDialog: React.FC<EditSupplierDialogProps> = ({
  supplier,
  onUpdate,
}) => {
  const [editedSupplier, setEditedSupplier] = useState({ ...supplier });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex =
    /^\(\d{2}\) \d{5}-\d{4}$|^\(\d{2}\) \d{4}-\d{4}$/;

  function validateFields() {
    const newErrors = {
      name: !editedSupplier.name,
      email: !editedSupplier.email || !emailRegex.test(editedSupplier.email),
      phone: !editedSupplier.phone || !phoneRegex.test(editedSupplier.phone),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }

  async function handleUpdate() {
    if (!validateFields()) {
      return;
    }

    const { id, name, email, phone } = editedSupplier;

    try {
      const response = await fetchApi(`/suppliers/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, email, phone }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar fornecedor");
      }

      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome"
            value={editedSupplier.name}
            onChange={(e) =>
              setEditedSupplier({ ...editedSupplier, name: e.target.value })
            }
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">Campo obrigatório</p>
          )}

          <Input
            placeholder="Email"
            value={editedSupplier.email}
            onChange={(e) =>
              setEditedSupplier({ ...editedSupplier, email: e.target.value })
            }
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">Campo inválido</p>
          )}

          <Input
            placeholder="Telefone (ex: (XX) XXXXX-XXXX)"
            value={editedSupplier.phone}
            onChange={(e) => {
              const formattedPhone = formatPhone(e.target.value);
              setEditedSupplier({ ...editedSupplier, phone: formattedPhone });
            }}
            maxLength={15}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">Campo inválido</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSupplierDialog;
