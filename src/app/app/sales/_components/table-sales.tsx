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

interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Sale {
  id: string;
  products: Product[];
  deliveryman: string;
  paymentMethod: string;
  customer: string;
  saleType: string;
  total: number;
  date: Date;
}


const mockSales: Sale[] = [
  {
    id: '1',
    products: [
      { id: 'P1', name: 'P1', quantity: 2, unitPrice: 5.0 },
      { id: 'P2', name: 'P2', quantity: 1, unitPrice: 10.0 },
    ],
    deliveryman: 'João',
    paymentMethod: 'Cartão',
    customer: 'Cliente A',
    saleType: 'Conteúdo',
    total: 20.0,
    date: new Date('2024-09-20'),
  },
  {
    id: '2',
    products: [
      { id: 'P20', name: 'P20', quantity: 5, unitPrice: 3.0 },
    ],
    deliveryman: 'Maria',
    paymentMethod: 'Dinheiro',
    customer: 'Cliente B',
    saleType: 'Vasilhame Cheio',
    total: 15.0,
    date: new Date('2024-09-21'),
  },
  {
    id: '3',
    products: [
      { id: 'P20', name: 'P20', quantity: 3, unitPrice: 4.0 },
    ],
    deliveryman: 'Pedro',
    paymentMethod: 'Pix',
    customer: 'Cliente C',
    saleType: 'Comodato',
    total: 12.0,
    date: new Date('2024-09-22'),
  },
  {
    id: '4',
    products: [
      { id: 'P10', name: 'P10', quantity: 1, unitPrice: 5.0 },
    ],
    deliveryman: 'Carlos',
    paymentMethod: 'Cartão',
    customer: 'Cliente D',
    saleType: 'Conteúdo',
    total: 5.0,
    date: new Date('2024-09-23'),
  },
  {
    id: '5',
    products: [
      { id: 'P28', name: 'P28', quantity: 10, unitPrice: 2.5 },
    ],
    deliveryman: 'José',
    paymentMethod: 'Dinheiro',
    customer: 'Cliente E',
    saleType: 'Vasilhame Cheio',
    total: 25.0,
    date: new Date('2024-09-24'),
  },
  {
    id: '6',
    products: [
      { id: 'P1', name: 'P1', quantity: 6, unitPrice: 3.0 },
    ],
    deliveryman: 'Ana',
    paymentMethod: 'Pix',
    customer: 'Cliente F',
    saleType: 'Comodato',
    total: 18.0,
    date: new Date('2024-09-25'),
  },
  // Novas vendas adicionadas
  {
    id: '7',
    products: [
      { id: 'P3', name: 'P3', quantity: 2, unitPrice: 7.0 },
    ],
    deliveryman: 'Luiz',
    paymentMethod: 'Cartão',
    customer: 'Cliente G',
    saleType: 'Conteúdo',
    total: 14.0,
    date: new Date('2024-09-26'),
  },
  {
    id: '8',
    products: [
      { id: 'P4', name: 'P4', quantity: 1, unitPrice: 15.0 },
      { id: 'P5', name: 'P5', quantity: 3, unitPrice: 4.0 },
    ],
    deliveryman: 'Fernanda',
    paymentMethod: 'Dinheiro',
    customer: 'Cliente H',
    saleType: 'Vasilhame Cheio',
    total: 27.0,
    date: new Date('2024-09-27'),
  },
  {
    id: '9',
    products: [
      { id: 'P6', name: 'P6', quantity: 4, unitPrice: 6.0 },
    ],
    deliveryman: 'Ricardo',
    paymentMethod: 'Pix',
    customer: 'Cliente I',
    saleType: 'Comodato',
    total: 24.0,
    date: new Date('2024-09-28'),
  },
  {
    id: '10',
    products: [
      { id: 'P7', name: 'P7', quantity: 5, unitPrice: 3.5 },
    ],
    deliveryman: 'Mariana',
    paymentMethod: 'Cartão',
    customer: 'Cliente J',
    saleType: 'Conteúdo',
    total: 17.5,
    date: new Date('2024-09-29'),
  },
  {
    id: '11',
    products: [
      { id: 'P8', name: 'P8', quantity: 7, unitPrice: 2.0 },
    ],
    deliveryman: 'Sofia',
    paymentMethod: 'Dinheiro',
    customer: 'Cliente K',
    saleType: 'Vasilhame Cheio',
    total: 14.0,
    date: new Date('2024-09-30'),
  },
  {
    id: '12',
    products: [
      { id: 'P9', name: 'P9', quantity: 1, unitPrice: 20.0 },
      { id: 'P10', name: 'P10', quantity: 2, unitPrice: 10.0 },
    ],
    deliveryman: 'Lucas',
    paymentMethod: 'Pix',
    customer: 'Cliente L',
    saleType: 'Comodato',
    total: 40.0,
    date: new Date('2024-10-01'),
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
                <TableCell>
                  {sale.products.map((product) => (
                    <div key={product.id}>
                      {product.name} (x{product.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {sale.products.reduce((total, product) => total + product.quantity, 0)}
                </TableCell>
                <TableCell>{sale.deliveryman}</TableCell>
                <TableCell>
                  {sale.products.reduce((total, product) => total + product.unitPrice, 0).toFixed(2)}
                </TableCell>
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
