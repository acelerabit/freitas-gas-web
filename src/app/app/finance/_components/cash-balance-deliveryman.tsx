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

interface DeliverymanCashBalance {
  id: string;
  name: string;
  cashBalance: number;
}

export function TableDeliverymenCashBalances() {
  const [deliverymen, setDeliverymen] = useState<DeliverymanCashBalance[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

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

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    fetchDeliverymenCashBalances();
  }, [page]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
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
  );
}
