"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import { fetchApi } from "@/services/fetchApi";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDelete } from "./confirm-delete-bank-account";
import { UpdateBankAccountDialog } from "./update-bank-account-dialog";

interface BankAccount {
  id: string;
  bank: string;
  paymentsAssociated: string[];
}

enum PaymentMethod {}

const paymentInterface = {
  PIX: "Pix",
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO: "Cartão de débito",
  DINHEIRO: "Dinheiro",
  FIADO: "À receber",
  TRANSFERENCIA: "Transferência",
};

export function ListBankAccounts() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankSelected, setBankSelected] = useState("");

  const { isOpen: isOpenDeleteModal, onOpenChange: onOpenChangeDeleteModal } =
    useModal();
  const { isOpen: isOpenUpdateModal, onOpenChange: onOpenChangeUpdateModal } =
    useModal();

  async function fetchBankAccounts() {
    const response = await fetchApi(`/bank-account`);

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

    const data = await response.json();

    setBankAccounts(data);
  }

  function openDelete(bankId: string) {
    setBankSelected(bankId);

    onOpenChangeDeleteModal();
  }

  function onCloseDelete() {
    setBankSelected("");

    onOpenChangeDeleteModal();
  }

  function openUpdate(bankId: string) {
    setBankSelected(bankId);

    onOpenChangeUpdateModal();
  }

  function onCloseUpdate() {
    setBankSelected("");

    onOpenChangeUpdateModal();
  }

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  return (
    <div className="space-y-4">
      {bankAccounts.map((bankAccount) => (
        <Card key={bankAccount.id}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>{bankAccount.bank}</CardTitle>

            <div className="space-x-4">
              <Button
                variant="ghost"
                onClick={() => openUpdate(bankAccount.id)}
              >
                <Pencil className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => openDelete(bankAccount.id)}
              >
                <Trash2 className="h-5 w-5 text-red-400" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {bankAccount.paymentsAssociated.map((payment) => (
              <p key={payment}>
                {paymentInterface[payment as keyof typeof paymentInterface]}
              </p>
            ))}
          </CardContent>
        </Card>
      ))}

      <ConfirmDelete
        open={isOpenDeleteModal}
        onOpenChange={onCloseDelete}
        bankId={bankSelected}
      />

      <UpdateBankAccountDialog
        open={isOpenUpdateModal}
        onOpenChange={onCloseUpdate}
        bankId={bankSelected}
      />
    </div>
  );
}
