"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { formatDateWithHours } from "@/utils/formatDate";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../_components/loading-page";
import Datepicker from "react-tailwindcss-datepicker";

const transactionCategoryLabels: { [key: string]: string } = {
  DEPOSIT: "Depósito",
  SALE: "Venda",
  EXPENSE: "Despesa",
  CUSTOM: "Personalizado",
};

interface User {
  id: string;
  accountAmount: number;
}

interface Deposit {
  id: string;
  transactionType: string;
  category: string;
  customCategory: string;
  amount: number;
  description: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
  bank: string;
}
interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

export function TableDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });
  const itemsPerPage = 10;

  const { user, loadingUser } = useUser();

  async function fetchDeposits() {
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/deposits`
    );

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    if (dateFilter.startDate) {
      fetchUsersUrl.searchParams.set(
        "startDate",
        dateFilter.startDate.toISOString().split("T")[0]
      );
    }
  
    if (dateFilter.endDate) {
      const endDateWithTime = new Date(dateFilter.endDate);
      endDateWithTime.setHours(23, 59, 59);
      
      fetchUsersUrl.searchParams.set(
        "endDate",
        endDateWithTime.toISOString().split("T")[0]
      );
    }

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setDeposits(data);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }
  const handleValueChange = (value: DateFilter | null) => {
    if (value) {
      setDateFilter({
        startDate: value.startDate ? new Date(value.startDate) : null,
        endDate: value.endDate ? new Date(value.endDate) : null,
      });
    } else {
      setDateFilter({ startDate: null, endDate: null });
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [page, dateFilter]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Depósitos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full flex items-center gap-2">
          <div onKeyDown={(e) => e.preventDefault()} className="w-full md:max-w-xs my-4">
            <Datepicker
              containerClassName="relative border rounded-md border-zinc-300"
              popoverDirection="down"
              primaryColor="blue"
              showShortcuts={true}
              placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
              displayFormat="DD/MM/YYYY"
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
              readOnly
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banco</TableHead>

              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Entregador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits &&
              deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell className="font-medium truncate">
                    {deposit.bank}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {fCurrencyIntlBRL(deposit.amount / 100)}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {formatDateWithHours(deposit.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {deposit?.user?.name}
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
            disabled={deposits.length < itemsPerPage}
            onClick={nextPage}
          >
            Próxima
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
