"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/services/fetchApi";

interface DeleteDebtDialogProps {
  open: boolean;
  onOpenChange: () => void;
  debtId: string;
}

const DeleteDebtDialog: React.FC<DeleteDebtDialogProps> = ({ open, onOpenChange, debtId }) => {
  async function handleDelete() {
    try {
      const response = await fetchApi(`/debts/${debtId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir débito");
      }

      onOpenChange();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir débito:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Débito</DialogTitle>
        </DialogHeader>
        <p>Tem certeza que deseja excluir este débito?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancelar</Button>
          <Button onClick={handleDelete}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDebtDialog;
