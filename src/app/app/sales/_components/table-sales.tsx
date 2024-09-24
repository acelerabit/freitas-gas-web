"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";

interface Sale {
  id: string;
  product: string;
  quantity: number;
  deliveryman: string;
  unitPrice: number;
  paymentMethod: string;
  customer: string;
  saleType: string;
  total: number;
  date: Date;
}

const mockSales: Sale[] = [
  {
    id: '1',
    product: 'P1',
    quantity: 2,
    deliveryman: 'João',
    unitPrice: 5.0,
    paymentMethod: 'Cartão',
    customer: 'Cliente A',
    saleType: 'Conteúdo',
    total: 10.0,
    date: new Date('2024-09-20'),
  },
  {
    id: '2',
    product: 'P20',
    quantity: 5,
    deliveryman: 'Maria',
    unitPrice: 3.0,
    paymentMethod: 'Dinheiro',
    customer: 'Cliente B',
    saleType: 'Vasilhame Cheio',
    total: 15.0,
    date: new Date('2024-09-21'),
  },
  {
    id: '3',
    product: 'P20',
    quantity: 3,
    deliveryman: 'Pedro',
    unitPrice: 4.0,
    paymentMethod: 'Pix',
    customer: 'Cliente C',
    saleType: 'Comodato',
    total: 12.0,
    date: new Date('2024-09-22'),
  },
  {
    id: '4',
    product: 'P10',
    quantity: 1,
    deliveryman: 'Carlos',
    unitPrice: 5.0,
    paymentMethod: 'Cartão',
    customer: 'Cliente D',
    saleType: 'Conteúdo',
    total: 5.0,
    date: new Date('2024-09-23'),
  },
  {
    id: '5',
    product: 'P28',
    quantity: 10,
    deliveryman: 'José',
    unitPrice: 2.5,
    paymentMethod: 'Dinheiro',
    customer: 'Cliente E',
    saleType: 'Vasilhame Cheio',
    total: 25.0,
    date: new Date('2024-09-24'),
  },
  {
    id: '6',
    product: 'P1',
    quantity: 6,
    deliveryman: 'Ana',
    unitPrice: 3.0,
    paymentMethod: 'Pix',
    customer: 'Cliente F',
    saleType: 'Comodato',
    total: 18.0,
    date: new Date('2024-09-25'),
  },
];

export function TableSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loadingSales, setLoadingSales] = useState(true);

  useEffect(() => {
    setLoadingSales(true);

    const paginatedSales = mockSales.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    setSales(paginatedSales);
    
    setLoadingSales(false);
  }, [page]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Entregador</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo de Venda</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.deliveryman}</TableCell>
                <TableCell>{sale.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{sale.saleType}</TableCell>
                <TableCell>{sale.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={`/sales/${sale.id}`}>Editar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end space-x-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Anterior
          </Button>
          <Button disabled={sales.length < itemsPerPage} onClick={() => setPage(page + 1)}>
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
