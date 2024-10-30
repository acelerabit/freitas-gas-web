"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchApi } from "@/services/fetchApi";
import { fCurrency, fCurrencyIntlBRL } from "@/utils/formatNumber";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  type: "P13" | "P20" | "P45",
  quantity: number;
  status: 'EMPTY' | 'FULL' | 'COMODATO'
}

interface Sale {
  id: string;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  products: Product[];
}

export function Stock() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  async function getSales() {
    const fetchSalesUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/list/comodato`
    );

    fetchSalesUrl.searchParams.set("page", String(page));
    fetchSalesUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

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

  useEffect(() => {
    getSales();
  }, [page]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens vendidos em comodato</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>

              <TableHead>Telefone</TableHead>

              {/* <TableHead>Valor</TableHead> */}
              <TableHead>Produtos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales &&
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.customer.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {sale.customer.email}
                  </TableCell>
                  <TableCell className="font-medium">
                    {sale.customer.phone}
                  </TableCell>
                  {/* <TableCell className="font-medium truncate">
                    {fCurrencyIntlBRL(sale.total)}
                  </TableCell> */}
                  <TableCell className="font-medium truncate">
                    {sale.products.map((product, index) => (
                      <p key={index}>
                        {product.type} {`(x${product.quantity})`}
                      </p>
                    ))}
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
