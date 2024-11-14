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


interface Collect {
  id: string;
  quantity: number;
  customer?: {
    name: string;
  };
  createdAt: string;
}

export function TableCollects() {
  const [collects, setCollects] = useState<Collect[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { user, loadingUser } = useUser();

  async function fetchCollects() {
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/collect`
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
    setCollects(data);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    fetchCollects();
  }, [page]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <Card className="col-span-2 sm:col-span-1 w-full">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-lg font-semibold">Coletas realizadas</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collects &&
            collects.map((collect) => (
              <TableRow key={collect.id}>
                <TableCell className="font-medium truncate">
                  {collect.customer?.name}
                </TableCell>
                <TableCell className="font-medium truncate">
                  {collect.quantity}
                </TableCell>
                <TableCell className="font-medium truncate">
                  {formatDateWithHours(collect.createdAt)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
    <div className="w-full flex gap-2 items-center justify-end flex-wrap">
      <Button
        className="disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={previousPage}
      >
        Anterior
      </Button>
      <Button
        className="disabled:cursor-not-allowed"
        disabled={collects.length < itemsPerPage}
        onClick={nextPage}
      >
        Próxima
      </Button>
    </div>
  </CardContent>
</Card>

  );
}
