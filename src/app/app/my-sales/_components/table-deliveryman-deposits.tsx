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
  id: string,
      transactionType: string,
      category: string,
      customCategory: string,
      amount: number,
      description: string,
      createdAt: string,
}

export function TableDeliverymanDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {user, loadingUser} = useUser()

  async function fetchDepositsDeliveryman() {
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/deposits/deliveryman/${user?.id}`
    );

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

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

  useEffect(() => {
    fetchDepositsDeliveryman();
  }, [page]);


  if(loadingUser) {
    return <LoadingAnimation />
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Depósitos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableCaption>Listagem de todas os depósitos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits &&
              deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  
                  <TableCell className="font-medium truncate">
                    {fCurrencyIntlBRL(deposit.amount / 100)}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {formatDateWithHours(deposit.createdAt)}
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
            Previous
          </Button>
          <Button
            className="disabled:cursor-not-allowed"
            disabled={deposits.length < itemsPerPage}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
