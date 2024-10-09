"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer } from "./table-customers";
import { fetchApi } from "@/services/fetchApi";

interface EditCustomerDialogProps {
  customer: Customer;
  onCustomerUpdated: () => void;
}

export function EditCustomerDialog({ customer, onCustomerUpdated }: EditCustomerDialogProps) {
  const [editCustomer, setEditCustomer] = useState(customer);
  const [errors, setErrors] = useState({ name: false, email: false });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateFields() {
    const newErrors = {
      name: !editCustomer.name,
      email: !editCustomer.email || !emailRegex.test(editCustomer.email),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }

  async function handleUpdateCustomer() {
    if (!validateFields()) {
      return;
    }

    const response = await fetchApi(`/customers/${customer.id}`, {
      method: "PATCH",
      body: JSON.stringify(editCustomer),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      onCustomerUpdated();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome"
            value={editCustomer.name}
            onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs">Campo obrigatório</p>}

          <Input
            placeholder="Email"
            value={editCustomer.email}
            onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs">Campo obrigatório</p>}

          <Input
            placeholder="Telefone"
            value={editCustomer.phone}
            onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
          />

          <Input
            placeholder="Rua"
            value={editCustomer.street}
            onChange={(e) => setEditCustomer({ ...editCustomer, street: e.target.value })}
          />

          <Input
            placeholder="Número"
            value={editCustomer.number}
            onChange={(e) => setEditCustomer({ ...editCustomer, number: e.target.value })}
          />

          <Input
            placeholder="Bairro"
            value={editCustomer.district}
            onChange={(e) => setEditCustomer({ ...editCustomer, district: e.target.value })}
          />

          <Input
            placeholder="Cidade"
            value={editCustomer.city}
            onChange={(e) => setEditCustomer({ ...editCustomer, city: e.target.value })}
          />

          <Input
            placeholder="Estado"
            value={editCustomer.state}
            onChange={(e) => setEditCustomer({ ...editCustomer, state: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateCustomer}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
