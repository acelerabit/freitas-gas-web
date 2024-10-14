"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/services/fetchApi";

interface DeleteSupplierDialogProps {
  supplierId: string;
  onSupplierDeleted: () => void;
}

export function DeleteSupplierDialog({ supplierId, onSupplierDeleted }: DeleteSupplierDialogProps) {
  async function handleDeleteSupplier() {
    const response = await fetchApi(`/suppliers/${supplierId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onSupplierDeleted();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Excluir</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Fornecedor</DialogTitle>
        </DialogHeader>
        <p>Tem certeza que deseja remover este fornecedor? Esta ação não pode ser desfeita.</p>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteSupplier}>Remover</Button>
          <Button variant="outline">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
