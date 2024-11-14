import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MarkAsPaidProps {
  open: boolean;
  onOpenChange: () => void;
  debtId: string;
}

export function MarkAsPaid({ open, onOpenChange, debtId }: MarkAsPaidProps) {
  const [selected, setSelected] = useState("");
  const [accountOptions, setAccountOptions] = useState<
    { id: string; value: string }[]
  >([]);

  async function markAsPaidTransaction() {
    if (!selected) {
      toast.error("Selecionar a conta é obrigatório", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return
    }

    const response = await fetchApi(`sales/mark-as-paid/${debtId}`, {
      method: "PATCH",
      body: JSON.stringify({
        bankAccountId: selected !== "caixa" ? selected : null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const respError = await response.json();

      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Movimentação atualizada com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    window.location.reload();
  }

  async function fetchBankAccounts() {
    const response = await fetchApi(`/bank-account`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);

      return;
    }

    const data = await response.json();

    const bankAccountOptions = data.map(
      (bankAccount: { id: string; bank: string }) => {
        return {
          id: bankAccount.id,
          value: bankAccount.bank,
        };
      }
    );

    setAccountOptions([...bankAccountOptions]);
  }
  useEffect(() => {
    if (open) {
      fetchBankAccounts();
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza dessa ação ?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa movimentação será definida como paga
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <Label>Conta</Label>
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
                  <SelectItem key={account.id} value={account.id}>
                    {account.value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={markAsPaidTransaction}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
