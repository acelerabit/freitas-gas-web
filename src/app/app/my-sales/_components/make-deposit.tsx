"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import LoadingAnimation from "../../_components/loading-page"
import useModal from "@/hooks/use-modal"
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
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
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { disablePastDates, handleDateAndTimeFormat } from "@/utils/formatDate"
import { SaleDialogForm } from "../../sales/_components/saleDialogForm"
import { AddTransactionDialog } from "../../expense/_components/add-transaction-dialog";


const formSchema = z
  .object({
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
  })

export function MakeDeposit() {
  const {user, loadingUser} = useUser()

  const {isOpen, onOpenChange} = useModal()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const date = handleDateAndTimeFormat(values.date, values.time)

    if(!date) {
      toast.error("Selecione uma data e horário válidos", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }


    const requestData = {
      transactionType: "ENTRY",
      category: 'DEPOSIT',
      amount: values.amount,
      deliverymanId: user?.id,
      depositDate: date,
      bank: values.bank
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
  };

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
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleOpenAddTransactionDialog = () => {
    setIsAddTransactionDialogOpen(true);
  };

  const handleCloseAddTransactionDialog = () => {
    setIsAddTransactionDialogOpen(false);
  };

  if(loadingUser) {
    return <LoadingAnimation />
  }

  return (
    <>
    <Card className="p-4 flex flex-col items-center justify-between">
      <CardHeader className="mb-2 text-center">
        <CardTitle>{user?.name}</CardTitle>
        <CardDescription>{user?.email}</CardDescription>
      </CardHeader>
      <div className="flex flex-col space-y-4">
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          CADASTRAR VENDA
        </Button>
        <Button onClick={onOpenChange} className="sm:w-auto">
          INFORMAR DEPÓSITO
        </Button>
        <Button onClick={handleOpenAddTransactionDialog} className="sm:w-auto">
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
          <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="banco"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
              <FormLabel >Data do depósito</FormLabel>
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
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
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
                    disabled={disablePastDates}
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
    <AddTransactionDialog
      open={isAddTransactionDialogOpen}
      onOpenChange={handleCloseAddTransactionDialog}
    />
    </>

  )
}