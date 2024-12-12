"use client";

import { useEffect, useState } from "react";
import { isBefore } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import LoadingAnimation from "../../_components/loading-page";
import useModal from "@/hooks/use-modal";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { disablePastDates, handleDateAndTimeFormat } from "@/utils/formatDate";
import { SaleDialogForm } from "../../sales/_components/saleDialogForm";
import { AddTransactionDialog } from "../../expense/_components/add-transaction-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddDeliverymanExpenseDialog } from "./add-deliveryman-expense-dialog";

const formSchema = z.object({
  date: z.date({
    required_error: "A data do depósito é obrigatória",
  }),
  time: z.string().min(1, "O horário é obrigatório"),
  bank: z.string().min(1, "A data é obrigatória").optional().nullable(),
  amount: z.coerce
    .number()
    .min(0, "insira um numero maior ou igual a 0")
    .positive("O valor deve ser um inteiro positivo.")
    .refine((val) => !isNaN(val), "insira um numero"),
});

export function MakeDeposit() {
  const { user, loadingUser } = useUser();

  const { isOpen, onOpenChange } = useModal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] =
    useState(false);
  const [selected, setSelected] = useState("");
  const [accountOptions, setAccountOptions] = useState<
    { id: string; value: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const date = handleDateAndTimeFormat(values.date, values.time);

    if (!date) {
      toast.error("Selecione uma data e horário válidos", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return
    }

    if (!selected) {
      toast.error("Selecionar a conta é obrigatório", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return
    }

    const bank = accountOptions.find(
      (accountOption) => accountOption.id === selected
    );
    const requestData = {
      transactionType: "ENTRY",
      category: "DEPOSIT",
      amount: values.amount,
      deliverymanId: user?.id,
      depositDate: date,
      bank: bank?.value,
      bankAccountId: selected !== "caixa" ? selected : null,
    };

    const response = await fetchApi(`/transactions/deposit`, {
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

    toast.success("Movimentação cadastrada com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    window.location.reload();
  }

  const handleFormSubmit = async (data: any) => {
    const response = await fetchApi("/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.message);
      return;
    }

    toast.success("Venda cadastrada com sucesso!");
    window.location.reload();
  };

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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleOpenAddTransactionDialog = () => {
    setIsAddTransactionDialogOpen(true);
  };

  const handleCloseAddTransactionDialog = () => {
    setIsAddTransactionDialogOpen(false);
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <Card className="p-4 flex flex-col items-center justify-between">
        <CardHeader className="mb-2 text-center">
          <CardTitle>{user?.name}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <div className="flex flex-col space-y-4">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            CADASTRAR VENDA
          </Button>
          <Button onClick={onOpenChange} className="sm:w-auto">
            INFORMAR DEPÓSITO
          </Button>
          <Button
            onClick={handleOpenAddTransactionDialog}
            className="sm:w-auto"
          >
            CADASTRAR DESPESA
          </Button>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informar depósito para empresa</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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

              <div className="grid grid-cols-3 gap-2 items-center">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-2 mt-2">
                      <FormLabel>Data do depósito</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd 'de' MMMM 'de' yyyy", {
                                  locale: ptBR,
                                })
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={ptBR}
                            disabled={(date) => !isBefore(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário do depósito</FormLabel>
                      <FormControl>
                        <Input
                          className="px-4 py-2"
                          placeholder="horário"
                          type="time"
                          {...field}
                          value={field.value}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex justify-end">
                <Button className="mt-4" type="submit">
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <SaleDialogForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
      />
      <AddDeliverymanExpenseDialog
        open={isAddTransactionDialogOpen}
        onOpenChange={handleCloseAddTransactionDialog}
      />
    </>
  );
}
