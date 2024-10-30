"use client";

import { Button } from "@/components/ui/button";
import Datepicker from "react-tailwindcss-datepicker";
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
import { formatDateWithHours, formatToUTCDate } from "@/utils/formatDate";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../_components/loading-page";


interface Product {
  id: string,
          type: string,
          price: number,
          quantity: number,
          status: string,
          productId: string,
          salePrice: number,
          typeSale: string,
}

interface Sale {
  id: string,
      customer: {
        id: string,
        name: string
      },
      deliveryman: {
        id: string;
        name: string;
      },
      products: Product[],
      paymentMethod: string,
      total: number,
      saleType: string,
      createdAt: string,
}

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

export function TableSalesLastSevenDays() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });
  const itemsPerPage = 10;

  const {user, loadingUser} = useUser()

  async function fetchSalesDeliveryman() {
    const fetchSalesUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/deliveryman/${user?.id}`
    );

    fetchSalesUrl.searchParams.set("page", String(page));
    fetchSalesUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    if (dateFilter.startDate && dateFilter.endDate) {
      const startDateFormat = formatToUTCDate(dateFilter.startDate);
      const endDateFormat = formatToUTCDate(dateFilter.endDate);

      fetchSalesUrl.searchParams.set("startDate", String(startDateFormat));
      fetchSalesUrl.searchParams.set("endDate", String(endDateFormat));
    }

    const response = await fetchApi(
      `${fetchSalesUrl.pathname}${fetchSalesUrl.search}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setSales(data);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  const handleValueChange = (newDateFilter: any) => {
    setDateFilter(newDateFilter);
  };

  useEffect(() => {
    fetchSalesDeliveryman();
  }, [page, dateFilter]);


  if(loadingUser) {
    return <LoadingAnimation />
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Suas vendas</CardTitle>
        
      </CardHeader>
      <CardContent className="space-y-4">
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
            />
          </div>
        </div>
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales &&
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.customer.name}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                  {sale.products.map((product, index) => (
              <p key={index}>
                {product.type} {`(x${product.quantity})`}
              </p>
            ))}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {fCurrencyIntlBRL(sale.total / 100)}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {formatDateWithHours(sale.createdAt)}
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
            disabled={sales.length < itemsPerPage}
            onClick={nextPage}
          >
            Próxima
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
