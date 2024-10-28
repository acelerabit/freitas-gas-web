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
        amount: (debt.amount / 100).toString(), // Formata o valor em centavos
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
          amount: Number(updatedDebt.amount.replace(",", ".")) * 100, // Converte para centavos
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

  const formatCurrency = (value: string) => {
    const parsedValue = parseFloat(value.replace(",", "."));
    return isNaN(parsedValue) ? "" : `R$ ${parsedValue.toFixed(2).replace(".", ",")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Débito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label>
            Valor
            <Input
              type="text"
              value={updatedDebt.amount}
              onChange={(e) => {
                const newValue = e.target.value.replace("R$ ", "").replace(".", "").replace(",", ".");
                setUpdatedDebt({ ...updatedDebt, amount: newValue });
              }}
              placeholder="0,00"
            />
          </label>
          <label>
            Vencimento
            <Input
              type="date"
              value={updatedDebt.dueDate}
              onChange={(e) => setUpdatedDebt({ ...updatedDebt, dueDate: e.target.value })}
            />
          </label>
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
