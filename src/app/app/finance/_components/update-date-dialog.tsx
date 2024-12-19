import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, formatISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/services/fetchApi";

export interface Transaction {
  id: string;
  transactionType: string;
  category: string;
  customCategory?: string;
  amount: number;
  description?: string;
  createdAt: string;
}

interface UpdateDateDialogProps {
  open: boolean;
  onOpenChange: () => void;
  transactionId: string;
  transaction?: Transaction;
}

export function UpdateDateDialog({
  open,
  onOpenChange,
  transactionId,
  transaction,
}: UpdateDateDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  async function update() {
    if (!selectedDate) {
      toast.error("Alguma data deve ser selecionada");
      return;
    }

    if (!transaction) {
      toast.error("Não foi possivel encontrar essa movimentação");
      return;
    }

    const formattedDate = formatISO(selectedDate);

    const requestData = {
      transactionType: transaction.transactionType,
      category: transaction.category,
      customCategory: transaction.customCategory,
      amount: transaction.amount,
      description: transaction.description,
      createdAt: formattedDate,
    };

    const response = await fetchApi(`/transactions/${transactionId}`, {
      method: "PATCH",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error || "Erro ao atualizar a movimentação.");
      return;
    }

    toast.success("Movimentação editada com sucesso.");

    window.location.reload();
  }


  useEffect(() => {
    if(transaction) {
      const date = new Date(transaction?.createdAt)

      setSelectedDate(date)
    }
  }, [transaction])

  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar data da movimentação</DialogTitle>
        </DialogHeader>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`text-left font-normal ${
                !selectedDate ? "text-muted-foreground" : ""
              }`}
            >
              {selectedDate ? (
                format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })
              ) : (
                <span>Escolha uma data</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <DialogFooter>
          <Button onClick={update}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
