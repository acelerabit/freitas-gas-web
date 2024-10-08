"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import TableSale from "./table-sale";
import { SaleDialogForm } from "./saleDialogForm";
import { fetchApi } from "@/services/fetchApi";

export function TableSales() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleFormSubmit = async (data: any) => {
    const response = await fetchApi("/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.message);
      return
    }

    toast.success("Venda cadastrada com sucesso!");
    handleCloseDialog();
    window.location.reload()
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
          <div className="flex justify-end mb-4">
            <Button onClick={handleOpenDialog} className="w-full sm:w-auto">
              Cadastrar Venda
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TableSale />
        </CardContent>
      </Card>
      <SaleDialogForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
