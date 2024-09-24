"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TableSales } from "./_components/table-sales";

export default function SalesPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Listagem de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button asChild>
              <Link href="/sales/new">Nova Venda</Link>
            </Button>
          </div>
          <TableSales />
        </CardContent>
      </Card>
    </div>
  );
}