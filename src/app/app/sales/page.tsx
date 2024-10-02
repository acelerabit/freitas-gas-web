"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TableSales } from "./_components/table-sales";
import TableSale from "./_components/table-sale";

export default function SalesPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Listagem de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSales />
        </CardContent>
      </Card>
    </div>
  );
}