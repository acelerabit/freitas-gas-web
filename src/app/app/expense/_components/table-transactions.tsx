import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";

interface Transaction {
  _id: string;
  amount: number;
  transactionType: string;
  category: string;
  userId: string;
  customCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionTypeLabels: { [key: string]: string } = {
  ENTRY: "Entrada",
  EXIT: "Saída",
  TRANSFER: "Transferência",
};

const transactionCategoryLabels: { [key: string]: string } = {
  DEPOSIT: "Depósito",
  SALE: "Venda",
  EXPENSE: "Despesa",
  CUSTOM: "Personalizado",
};

export function TableTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  async function getTransactions() {
    setLoadingTransactions(true);
    const fetchTransactionsUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions`
    );

    fetchTransactionsUrl.searchParams.set("page", String(page));
    fetchTransactionsUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchTransactionsUrl.pathname}${fetchTransactionsUrl.search}`
    );

    if (!response.ok) {
      setLoadingTransactions(false);
      return;
    }

    const data = await response.json();
    const transactionsList = data.map((item: any) => ({
      _id: item._id,
      amount: item._props.amount,
      transactionType: transactionTypeLabels[item._props.transactionType],
      category: transactionCategoryLabels[item._props.category],
      userId: item._props.userId,
      customCategory: item._props.customCategory || '-',
    }));

    setTransactions(transactionsList);
    setLoadingTransactions(false);
  }

  async function getUsersAll() {
    setLoadingUsers(true);
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/all`
    );

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      setLoadingUsers(false);
      return {};
    }

    const usersData = await response.json();
    const userMap = usersData.reduce((acc: { [key: string]: string }, user: any) => {
      acc[user._id] = user.props.email;
      return acc;
    }, {});
    
    setUsersMap(userMap);
    setLoadingUsers(false);
  }

  useEffect(() => {
    getUsersAll();
    getTransactions();
  }, [page]);

  const formatCurrency = (value: number) => {
    const isValueInCents = value >= 1000;
    const divisor = isValueInCents ? 100 : 1;
    return (value / divisor).toFixed(2).replace(".", ",");
  };

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  return (
    <>
      <Table className="min-w-full">
        <TableCaption>Listagem de todas as transações</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de Transação</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Detalhes</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingTransactions || loadingUsers ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Carregando...</TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Nenhuma transação encontrada.</TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.transactionType}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{usersMap[transaction.userId] || "Desconhecido"}</TableCell>
                <TableCell>{transaction.customCategory}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="w-full flex gap-2 items-center justify-end mt-4">
        <Button
          className="disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={previousPage}
        >
          Anterior
        </Button>
        <Button
          className="disabled:cursor-not-allowed"
          disabled={transactions.length < itemsPerPage}
          onClick={nextPage}
        >
          Próxima
        </Button>
      </div>
    </>
  );
}
