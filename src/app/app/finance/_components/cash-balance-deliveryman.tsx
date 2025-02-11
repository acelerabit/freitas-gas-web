import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import LoadingAnimation from "../../_components/loading-page";
import useModal from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "react-currency-mask";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import { isBefore } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { handleDateAndTimeFormat } from "@/utils/formatDate";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeliverymanCashBalance {
  deliverymanId: string;
  id: string;
  name: string;
  cashBalance: number;
}

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

export function TableDeliverymenCashBalances() {
  const [deliverymen, setDeliverymen] = useState<DeliverymanCashBalance[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [deliverymanId, setDeliverymanId] = useState("");

  const [accountOptions, setAccountOptions] = useState<
    { id: string; value: string }[]
  >([]);

  const { isOpen, onOpenChange } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const date = handleDateAndTimeFormat(values.date, values.time);

    console.log(date)

    if (!date) {
      toast.error("Selecione uma data e horário válidos", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    if (!selected) {
      toast.error("Selecionar a conta é obrigatório", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    const bank = accountOptions.find(
      (accountOption) => accountOption.id === selected
    );
    const requestData = {
      transactionType: "ENTRY",
      category: "DEPOSIT",
      amount: values.amount,
      deliverymanId: deliverymanId,
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

  async function fetchDeliverymenCashBalances() {
    setLoading(true);
    const fetchDeliverymenUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/cashBalance`
    );

    fetchDeliverymenUrl.searchParams.set("page", String(page));
    fetchDeliverymenUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchDeliverymenUrl.pathname}${fetchDeliverymenUrl.search}`
    );

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    setDeliverymen(data);
    setLoading(false);
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

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  function handleOpenModal(id: string) {
    setDeliverymanId(id);

    onOpenChange();
  }

  useEffect(() => {
    fetchDeliverymenCashBalances();
  }, [page]);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  console.log(deliverymanId);

  return (
    <>
      <Card className="col-span-2 mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            Entregadores com saldo em dinheiro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entregador</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliverymen &&
                deliverymen.map((deliveryman) => (
                  <TableRow key={deliveryman.id}>
                    <TableCell className="font-medium truncate">
                      {deliveryman.name}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {fCurrencyIntlBRL(deliveryman.cashBalance)}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      <Button
                        onClick={() =>
                          handleOpenModal(deliveryman.deliverymanId)
                        }
                      >
                        Informar depósito
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="w-full flex gap-2 items-center justify-end">
            <Button
              className="disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={previousPage}
            >
              Anterior
            </Button>
            <Button
              className="disabled:cursor-not-allowed"
              disabled={deliverymen.length < itemsPerPage}
              onClick={nextPage}
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>

      {deliverymanId && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Informar depósito para empresa</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
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
                                  format(
                                    field.value,
                                    "dd 'de' MMMM 'de' yyyy",
                                    {
                                      locale: ptBR,
                                    }
                                  )
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
      )}
    </>
  );
}
