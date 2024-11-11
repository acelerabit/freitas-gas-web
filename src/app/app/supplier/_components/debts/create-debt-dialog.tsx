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
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

  const [selected, setSelected] = useState("caixa");
  const [accountOptions, setAccountOptions] = useState<{id: string, value: string}[]>([]);

  const [errors, setErrors] = useState({
    amount: false,
    dueDate: false,
    bankAccount: false,
  });

  function validateFields() {
    const newErrors = {
      amount:
        !newDebt.amount || isNaN(Number(newDebt.amount.replace(/[^0-9]/g, ""))),
      dueDate: !newDebt.dueDate,
      bankAccount: newDebt.paid && !selected,
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
          amount: Number(newDebt.amount.replace(/[^0-9]/g, "")),
          dueDate: newDebt.dueDate,
          paid: newDebt.paid,
          bankAccountId: selected !== "caixa" ? selected : null,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao criar débito");
      }

      setNewDebt({ amount: "", dueDate: "", paid: false });
      setErrors({ amount: false, dueDate: false, bankAccount: false });
      onOpenChange();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar débito:", error);
    }
  }

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, "");
    const numberValue = parseInt(cleanValue, 10) / 100;
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = inputValue.replace(/[^\d]/g, "");
    setNewDebt({
      ...newDebt,
      amount: formatCurrency(cleanValue),
    });
  };

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
      { id: "caixa", value: "Caixa" },
    ]);
  }

  useEffect(() => {
    if (open) {
      fetchBankAccounts();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Débito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Valor (R$)
            </label>
            <Input
              type="text"
              placeholder="Valor"
              value={newDebt.amount}
              onChange={handleAmountChange}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">
                Campo obrigatório e deve ser um número
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Vencimento
            </label>
            <Input
              type="date"
              placeholder="Data de Vencimento"
              value={newDebt.dueDate}
              onChange={(e) =>
                setNewDebt({ ...newDebt, dueDate: e.target.value })
              }
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs">Campo obrigatório</p>
            )}
          </div>

          <div className="flex items-center">
            <Checkbox
              checked={newDebt.paid}
              onCheckedChange={(checked) =>
                setNewDebt({ ...newDebt, paid: !!checked })
              }
            />
            <span className="ml-2">Pago</span>
          </div>

          {newDebt.paid && (
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
                    <SelectItem value={account.id}>{account.value}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDebtDialog;
