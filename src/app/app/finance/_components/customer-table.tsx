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
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import LoadingAnimation from "../../_components/loading-page";

interface CustomerDebt {
  customerId: string;
  customerName: string;
  totalDebt: number;
}

export function TableCustomersWithDebts() {
  const [customers, setCustomers] = useState<CustomerDebt[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  async function fetchCustomersWithDebts() {
    setLoading(true);
    const fetchCustomersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/customers-with-debts`
    );

    fetchCustomersUrl.searchParams.set("page", String(page));
    fetchCustomersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchCustomersUrl.pathname}${fetchCustomersUrl.search}`
    );

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    setCustomers(data);
    setLoading(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    fetchCustomersWithDebts();
  }, [page]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <Card className="col-span-2 mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Clientes com Dívidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor a Receber</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers &&
                customers.map((customer) => (
                    <TableRow key={customer.customerId}>
                    <TableCell className="font-medium truncate">
                        {customer.customerName}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                        {fCurrencyIntlBRL(customer.totalDebt)}
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
                disabled={customers.length < itemsPerPage}
                onClick={nextPage}
            >
                Próxima
            </Button>
            </div>
        </CardContent>
    </Card>
  );
}
