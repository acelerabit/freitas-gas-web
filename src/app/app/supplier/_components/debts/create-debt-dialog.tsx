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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { fetchApi } from "@/services/fetchApi";

interface NewDebt {
  amount: string;
  dueDate: string;
  paid: boolean;
}

interface CreateDebtDialogProps {
  open: boolean;
  onOpenChange: () => void;
  supplierId: string | undefined;
}

const CreateDebtDialog: React.FC<CreateDebtDialogProps> = ({
  open,
  onOpenChange,
  supplierId,
}) => {
  const [newDebt, setNewDebt] = useState<NewDebt>({
    amount: "",
    dueDate: "",
    paid: false,
  });

  const [errors, setErrors] = useState({
    amount: false,
    dueDate: false,
  });

  function validateFields() {
    const newErrors = {
      amount: !newDebt.amount || isNaN(Number(newDebt.amount)),
      dueDate: !newDebt.dueDate,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }

  async function handleCreate() {
    if (!validateFields()) {
      return;
    }

    try {
        const response = await fetchApi(`/debts`, {
            method: "POST",
            body: JSON.stringify({
              supplierId: supplierId,
              amount: Number(newDebt.amount),
              dueDate: newDebt.dueDate,
              paid: newDebt.paid,
            }),
            headers: { "Content-Type": "application/json" },
          });

        if (!response.ok) {
            throw new Error("Erro ao criar débito");
        }

        setNewDebt({ amount: "", dueDate: "", paid: false });
        setErrors({ amount: false, dueDate: false });
        onOpenChange();
        window.location.reload();
    } catch (error) {
      console.error("Erro ao criar débito:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Débito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Valor"
            value={newDebt.amount}
            onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
            className={errors.amount ? "border-red-500" : ""}
          />
          {errors.amount && <p className="text-red-500 text-xs">Campo obrigatório e deve ser um número</p>}

          <Input
            type="date"
            placeholder="Data de Vencimento"
            value={newDebt.dueDate}
            onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
            className={errors.dueDate ? "border-red-500" : ""}
          />
          {errors.dueDate && <p className="text-red-500 text-xs">Campo obrigatório</p>}

          <div className="flex items-center">
            <Checkbox
              checked={newDebt.paid}
              onCheckedChange={(checked) => 
                setNewDebt({ ...newDebt, paid: !!checked })
              }
            />
            <span className="ml-2">Pago</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDebtDialog;
