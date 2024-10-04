import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { fetchApi } from "@/services/fetchApi";

interface DeleteSaleDialogProps {
  open: boolean;
  onOpenChange: () => void;
  saleId: string;
}

export function DeleteSaleDialog({
  open,
  onOpenChange,
  saleId,
}: DeleteSaleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSale = async () => {
    setIsDeleting(true);

    const response = await fetchApi(`/sales/${saleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error || "Erro ao deletar a venda.");
      setIsDeleting(false);
      return;
    }

    toast.success("Venda deletada com sucesso.");
    setIsDeleting(false);
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
        </DialogHeader>
        <p>Você tem certeza que deseja deletar esta venda? Essa ação não pode ser desfeita.</p>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onOpenChange}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteSale}
            disabled={isDeleting}
          >
            {isDeleting ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
