"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrencyInput } from "react-currency-mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface TransferTransactionDialogProps {
  open: boolean;
  onOpenChange: () => void;
  transferAccountId: string;
}

interface User {
  id: string;
  name: string;
}

const formSchema = z.object({
  // originAccountId: z.string().min(1, "Conta de origem é obrigatória"),
  // destinationAccountId: z.string().min(1, "Conta de destino é obrigatória"),
  value: z.coerce
    .number()
    .min(0, "insira um numero maior ou igual a 0")
    .positive("O valor deve ser um inteiro positivo.")
    .refine((val) => !isNaN(val), "insira um numero"),
});

export function UpdateAccountTransferDialog({
  open,
  onOpenChange,
  transferAccountId,
}: TransferTransactionDialogProps) {
  const { user, loadingUser } = useUser();

  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const [accountOptions, setAccountOptions] = useState<
    { id: string; value: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedOrigin && !selectedDestination) {
      toast.error("Selecionar a conta é obrigatório", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return
    }

    const requestData = {
      destinationAccountId: selectedDestination,
      originAccountId: selectedOrigin,
      value: values.value,
    };

    const response = await fetchApi(`/account-transfer/${transferAccountId}`, {
      method: "PUT",
      body: JSON.stringify(requestData),
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

    toast.success("Transferência concluida com sucesso", {
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

  async function getAccountTransfer() {
    console.log(transferAccountId);
    const response = await fetchApi(
      `/account-transfer/get/${transferAccountId}`
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);

      return;
    }

    const data = await response.json();

    setSelectedOrigin(data.originAccountId);
    setSelectedDestination(data.destinationAccountId);
    form.setValue("value", data.value / 100);
  }

  useEffect(() => {
    if (open) {
      fetchBankAccounts();
      getAccountTransfer();
    }
  }, [open]);

  if (!user) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transferência</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div>
              <Label>Conta de origem</Label>
              <Select
                value={selectedOrigin}
                onValueChange={(value) => setSelectedOrigin(value)}
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

            <div>
              <Label>Conta de destino</Label>
              <Select
                value={selectedDestination}
                onValueChange={(value) => setSelectedDestination(value)}
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

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={field.value}
                      onChangeValue={(_, value) => {
                        field.onChange(value);
                      }}
                      InputElement={
                        <input
                          type="text"
                          id="currency"
                          placeholder="R$ 0,00"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end">
              <Button className="mt-4" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
