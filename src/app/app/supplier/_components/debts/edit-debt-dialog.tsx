"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";

interface EditDebtDialogProps {
  open: boolean;
  onOpenChange: () => void;
  debt: any;
}

const EditDebtDialog: React.FC<EditDebtDialogProps> = ({ open, onOpenChange, debt }) => {
  const [updatedDebt, setUpdatedDebt] = useState({
    amount: "",
    dueDate: "",
    paid: false,
  });

  useEffect(() => {
    if (debt) {
      setUpdatedDebt({
        amount: debt.amount,
        dueDate: debt.dueDate ? new Date(debt.dueDate).toISOString().split("T")[0] : "",
        paid: debt.paid,
      });
    }
  }, [debt]);

  async function handleUpdate() {
    try {
      const response = await fetchApi(`/debts/${debt.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...updatedDebt,
          amount: Number(updatedDebt.amount),
          dueDate: new Date(updatedDebt.dueDate),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar débito");
      }

      onOpenChange();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar débito:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Débito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            value={updatedDebt.amount}
            onChange={(e) => setUpdatedDebt({ ...updatedDebt, amount: e.target.value })}
            placeholder="Valor"
          />
          <Input
            type="date"
            value={updatedDebt.dueDate}
            onChange={(e) => setUpdatedDebt({ ...updatedDebt, dueDate: e.target.value })}
          />
          <div className="flex items-center">
            <Checkbox
              checked={updatedDebt.paid}
              onCheckedChange={(checked) => setUpdatedDebt({ ...updatedDebt, paid: !!checked })}
            />
            <span className="ml-2">Pago</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDebtDialog;
