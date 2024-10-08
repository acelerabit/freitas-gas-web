import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; 
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";

interface Transaction {
  _id: string;
  amount: number;
  transactionType: string;
  category: string;
  userId: string;
  customCategory?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface EditTransactionDialogProps {
  isOpen: boolean;
  transaction: Transaction;
  onClose: () => void;
}

const transactionTypeLabels: { [key: string]: string } = {
  ENTRY: "Entrada",
  EXIT: "Saída",
  TRANSFER: "Transferência",
};

const categoryLabels: { [key: string]: string } = {
  DEPOSIT: "Depósito",
  SALE: "Venda",
  EXPENSE: "Despesa",
  CUSTOM: "Personalizado",
};

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({ isOpen, transaction, onClose }) => {
  const [updatedTransaction, setUpdatedTransaction] = useState<Transaction>(transaction);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdatedTransaction(transaction);
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdatedTransaction({
      ...updatedTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTransaction = async () => {
    setLoading(true);
    const updatedAmount = typeof updatedTransaction.amount === 'string'
        ? parseInt(updatedTransaction.amount, 10) 
        : updatedTransaction.amount;
    const response = await fetchApi(`/transactions/${transaction._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updatedTransaction,
        amount: updatedAmount,
      }),
    });

    if (response.ok) {
      onClose();
      window.location.reload();
    } else {
      console.error("Falha ao atualizar a transação");
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor</label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={updatedTransaction.amount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">Tipo de Transação</label>
            <Select
              value={updatedTransaction.transactionType}
              onValueChange={(value) => setUpdatedTransaction({ ...updatedTransaction, transactionType: value })}
            >
              <SelectTrigger id="transactionType">
                <SelectValue placeholder="Selecione o tipo de transação" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(transactionTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
            <Select
              value={updatedTransaction.category}
              onValueChange={(value) => setUpdatedTransaction({ ...updatedTransaction, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <Input
              id="description"
              name="description"
              value={updatedTransaction.description || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleUpdateTransaction} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
