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

interface TransferTransactionDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

interface User {
  id: string;
  name: string;
}

const formSchema = z.object({
  userId: z.string().min(1, "Entregador é obrigatório"),
  type: z.string().optional().nullable(),
  customCategory: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.coerce
    .number()
    .min(0, "insira um numero maior ou igual a 0")
    .positive("O valor deve ser um inteiro positivo.")
    .refine((val) => !isNaN(val), "insira um numero"),
}).refine(
  (data) => {
    if (data.type === "OTHER") {
      return !!data.customCategory;
    }
    return true;
  },
  {
    message: "O campo categoria customizada é obrigatório quando o tipo é 'outros'",
    path: ["customCategory"],
  }
);

export function TransferTransactionDialog({
  open,
  onOpenChange,
}: TransferTransactionDialogProps) {
  const { user, loadingUser } = useUser();

  const [deliverymans, setDeliverymans] = useState<User[]>([]);
  const [expenseTypeOptions, setExpenseTypeOptions] = useState([
    {
      key: "combustível",
      value: "combustível",
    },
    { key: "oficina mecânica", value: "oficina mecânica" },
    { key: "outros", value: "outros" },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const requestData = {
      transactionType: "TRANSFER",
      category: "TRANSFER",
      customCategory: values.customCategory ?? values.type,
      amount: values.amount,
      description: values.description
    };

    const response = await fetchApi(`/transactions/transfer/${values.userId}`, {
      method: "POST",
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

  async function getDeliverymans() {
    const response = await fetchApi(`/users/deliverymans`);

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

    setDeliverymans(data);
  }

  async function getExpenseTypes() {
    const response = await fetchApi(`/transactions/expense/types`);

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

    const otherExpenseTypes = data.map(
      (expenseType: { id: string; name: string }) => {
        return {
          key: expenseType.name,
          value: expenseType.name,
        };
      }
    );

    const expenseTypesUpdate: any = [
      ...otherExpenseTypes,
      ...expenseTypeOptions,
    ];

    setExpenseTypeOptions(expenseTypesUpdate);
  }

  useEffect(() => {
    getDeliverymans();
    getExpenseTypes();
  }, []);

  if (!user) {
    return;
  }

  const expenseTypeWatch = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transferência</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entregador</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o entregador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deliverymans.map((deliveryman) => (
                        <SelectItem key={deliveryman.id} value={deliveryman.id}>
                          {deliveryman.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de despesa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de despesa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseTypeOptions.map((expenseType) => (
                        <SelectItem
                          key={expenseType.key}
                          value={expenseType.key}
                        >
                          {expenseType.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {expenseTypeWatch === "outros" && (
              <FormField
                control={form.control}
                name="customCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da nova categoria</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nome da categoria"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
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

<FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da movimentação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="descrição"
                      {...field}
                      value={field.value ?? ""}
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
