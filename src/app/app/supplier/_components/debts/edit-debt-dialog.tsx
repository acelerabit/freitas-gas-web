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
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [selected, setSelected] = useState("");

  const [accountOptions, setAccountOptions] = useState<{id: string, value: string}[]>([]);

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
    if(updatedDebt.paid && !selected) {
      toast.error('Deve ser selecionada a conta associada ao pagamento desse débito.')

      return
    }
    
    try {
      const response = await fetchApi(`/debts/${debt.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...updatedDebt,
          amount: Number(updatedDebt.amount.replace(",", ".")) * 100, // Converte para centavos
          dueDate: new Date(updatedDebt.dueDate),
          bankAccountId: selected !== "caixa" ? selected : null,
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

  async function fetchBankAccounts() {
    const response = await fetchApi(`/bank-account`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);

      return;
    }

    const data = await response.json();

    const bankAccountOptions = data.map((bankAccount: {id: string, bank: string}) => {
      return {
        id: bankAccount.id,
        value: bankAccount.bank,
      };
    });

    setAccountOptions([
      ...bankAccountOptions,
    ]);
  }

  useEffect(() => {
    if (open) {
      fetchBankAccounts();
    }
  }, [open]);

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

          {updatedDebt.paid && (
            <Select
              value={selected}
              onValueChange={(value) => setSelected(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Conta" />
              </SelectTrigger>
              <SelectContent>
                {accountOptions.map((account) => {
                  return (
                    <SelectItem key={account.id} value={account.id}>{account.value}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
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
