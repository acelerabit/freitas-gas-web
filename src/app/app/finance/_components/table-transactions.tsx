"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

import LoadingAnimation from "@/app/app/_components/loading-page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import Link from "next/link";
import { toast } from "sonner";

import useModal from "@/hooks/use-modal";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import { formatDateWithHours, formatToUTC, formatToUTCDate } from "@/utils/formatDate";
import { SearchTransactions } from "./search-transaction";
import { DataTable } from "./data-table-transactions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDelete } from "./confirm-delete";
import { UpdateDateDialog } from "./update-date-dialog";

const transactionTypeLabels: { [key: string]: string } = {
  ENTRY: "Entrada",
  EXIT: "Saída",
  TRANSFER: "Transferência",
};

const transactionCategoryLabels: { [key: string]: string } = {
  INCOME: "Entrada",
  WITHDRAW: "Saida",
  DEPOSIT: "Depósito",
  SALE: "Venda",
  EXPENSE: "Despesa",
  CUSTOM: "Personalizado",
  TRANSFER: 'Transferência'
};

const categories = [
  {
    name: "Entrada",
    value: "INCOME",
  },
  {
    name: "Saida",
    value: "WITHDRAW",
  },
  {
    name: "Venda",
    value: "SALE",
  },
  {
    name: "Despesa",
    value: "EXPENSE",
  },
  {
    name: "Transferência",
    value: "TRANSFER",
  },
];


export type TransactionType = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
  TRANSFER: 'TRANSFER'
};

export type TransactionCategory = {
  DEPOSIT: 'DEPOSIT',
  SALE: 'SALE',
  EXPENSE: 'EXPENSE',
  CUSTOM: 'CUSTOM'
};

const transactionCategorySymbol = {
  INCOME: "+",
  WITHDRAW: "-",
  DEPOSIT: "-",
  SALE: "+",
  EXPENSE: "-",
  TRANSFER: '-'
};

export interface Transaction {
  id: string;
  transactionType: string;
  category: string;
  customCategory?: string;
  amount: number;
  description?: string;
  createdAt: string;
}

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}


type SortType =
  | "createdAt"
  | "customer"
  | "transactionType"
  | "category"
  | "amount"
  | "customCategory"

export default function TableTransaction() {
  const [transactions, setTransactions] = useState<Transaction[] | []>([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  const [orderByField, setOrderByField] = useState<SortType>("createdAt");
  const [orderDirection, setOrderDirection] = useState<"desc" | "asc">("desc");

  const itemsPerPage = 10;
  const [filter, setFilter] = useState("");
  const { user, loadingUser } = useUser();

  const {isOpen: confirmDeleteOpen, onOpenChange: confirmDeleteOnOpenChange} = useModal()
  const {isOpen: updateDateOpen, onOpenChange: updateDateOnOpenChange} = useModal()


  const handleSort = (sortField: SortType, direction: "desc" | "asc") => {
    setOrderByField(sortField);
    setOrderDirection(direction);
  };

  const handleValueChange = (newDateFilter: any) => {
    setDateFilter(newDateFilter);
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort(
                "category",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Tipo de movimentação
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "category" && (
              <span className="text-[8px]">
                {/* {column.getIsSorted() && column.getIsSorted()} */}
                {orderDirection}
              </span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p>{transactionCategoryLabels[row.original.category]}</p>;
      },
    },
    {
      accessorKey: "customCategory",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort("customCategory", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Categoria
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "customCategory" && (
              <span className="text-[8px]">
                {/* {column.getIsSorted() && column.getIsSorted()} */}
                {orderDirection}
              </span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p>{row.original.customCategory}</p>;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return <p>Descrição</p>;
      },
      cell: ({ row }) => {
        return (
          <p>
            {row.original.description}
          </p>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort("amount", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "amount" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p className="min-w-32">{transactionCategorySymbol[row.original.category as keyof typeof transactionCategorySymbol]} {fCurrencyIntlBRL(row.original.amount / 100)} </p>;
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort(
                "createdAt",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Criado em
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "createdAt" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const formatted = formatDateWithHours(row.original.createdAt);

        return <div>{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-6 w-6 p-0 flex items-center justify-center"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              {/* <DropdownMenuItem asChild>
                <Link
                  href={`/app/transactions/${row.original.id}`}
                  className="text-sm"
                >
                  Ver detalhes
                </Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem asChild>
                <Button
                  className="w-full cursor-pointer"
                  onClick={() => {
                    setTransactionId(row.original.id);
                    // updateTransactionOnOpenChange();
                  }}
                >
                  Editar
                </Button>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  className="w-full cursor-pointer"
                  onClick={() => {
                    setTransactionId(row.original.id);
                    updateDateOnOpenChange()
                  }}
                >
                  Atualizar data
                </Button>
              </DropdownMenuItem>

              <DropdownMenuSeparator />


              <DropdownMenuItem asChild>
                <Button
                  variant="destructive"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    setTransactionId(row.original.id);
                    confirmDeleteOnOpenChange()
                  }}
                >
                  Deletar
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
            
          </DropdownMenu>
        );
      },
    },
  ];

  function handleFilterProjects(filter: string) {
    setPage(1);
    setFilter(filter);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  const queryData = async () => {
    const fetchTransactionsUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions`
    );

    if (filter) {
      // fetchTransactionsUrl.searchParams.set("category", filter);
      fetchTransactionsUrl.searchParams.set("type", filter);
    }

    if (dateFilter.startDate && dateFilter.endDate) {
      const startDateFormat = formatToUTCDate(dateFilter.startDate);
      const endDateFormat = formatToUTCDate(dateFilter.endDate);

      fetchTransactionsUrl.searchParams.set(
        "startDate",
        String(startDateFormat)
      );
      fetchTransactionsUrl.searchParams.set("endDate", String(endDateFormat));
    }

    if (category && category != "none") {
      fetchTransactionsUrl.searchParams.set(
        "category",
        category
      );
    }

    fetchTransactionsUrl.searchParams.set("orderByField", orderByField);
    fetchTransactionsUrl.searchParams.set("orderDirection", orderDirection);

    fetchTransactionsUrl.searchParams.set("page", String(page));
    fetchTransactionsUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchTransactionsUrl.pathname}${fetchTransactionsUrl.search}`
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    const data = await response.json();

    const transactionsList = data.map((item: any) => ({
      id: item._id,
      amount: item._props.amount,
      transactionType: item._props.transactionType,
      category: item._props.category,
      userId: item._props.userId,
      customCategory: item._props.customCategory || "-",
      description: item._props.description || "-",
      createdAt: item._props.createdAt || "",
    }));

    setTransactions(transactionsList);
  };

  useEffect(() => {
    queryData();
  }, [
    filter,
    page,
    orderDirection,
    orderByField,
    dateFilter,
    category,
  ]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      <div>
        <div className="w-full flex items-center justify-between">
          <SearchTransactions handleFilterTransactions={handleFilterProjects} />
        </div>
        <div className="w-full flex items-center gap-2">
          <div className="w-full md:max-w-xs my-4">
            <Datepicker
              containerClassName="relative border rounded-md border-zinc-300"
              popoverDirection="down"
              primaryColor={"blue"}
              showShortcuts={true}
              placeholder={"DD/MM/YYYY ~ DD/MM/YYYY"}
              displayFormat={"DD/MM/YYYY"}
              value={dateFilter}
              onChange={handleValueChange}
              configs={{
                shortcuts: {
                  today: "Hoje",
                  yesterday: "Ontem",
                  past: (period) => `Últimos ${period} dias`,
                  currentMonth: "Mês atual",
                  pastMonth: "Último mês",
                },
                footer: {
                  cancel: "Cancelar",
                  apply: "Aplicar",
                },
              }}
              i18n="pt-br"
            />
          </div>
          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Selecione um tipo de movimentação" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de movimentação</SelectLabel>
                <SelectItem value="none">---- Nenhum ----</SelectItem>
                {categories.map((category) => {
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative pb-10 rounded-md">
        <DataTable
          columns={columns}
          data={transactions}
          page={page}
          itemsPerPage={itemsPerPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </div>

      <ConfirmDelete transactionId={transactionId} open={confirmDeleteOpen} onOpenChange={confirmDeleteOnOpenChange} />
      <UpdateDateDialog transactionId={transactionId} open={updateDateOpen} onOpenChange={updateDateOnOpenChange} transaction={transactions.find(transaction => transaction.id === transactionId)} />

    </div>
  );
}
