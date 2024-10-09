"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/services/fetchApi";

interface DeleteCustomerDialogProps {
  customerId: string;
  onCustomerDeleted: () => void;
}

export function DeleteCustomerDialog({ customerId, onCustomerDeleted }: DeleteCustomerDialogProps) {
  async function handleDeleteCustomer() {
    const response = await fetchApi(`/customers/${customerId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onCustomerDeleted();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Remover</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Cliente</DialogTitle>
        </DialogHeader>
        <p>Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita.</p>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteCustomer}>Remover</Button>
          <Button variant="outline">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
