"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import TableTransaction from "./_components/table-transactions";
import useModal from "@/hooks/use-modal";
import { AddTransactionDialog } from "./_components/add-transaction-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyBalance } from "./_components/company-balance";
import { TransferTransactionDialog } from "./_components/transfer-transaction-dialog";
import { TableDeposits } from "./_components/deposit-table";

export default function Finance() {
  const { isOpen, onOpenChange } = useModal();
  const { isOpen: isOpenTransfer, onOpenChange: onOpenChangeTransfer } = useModal();

  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Financeiro</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>financeiro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <CompanyBalance />

        <div className="w-full flex items-center justify-end">
          <div className="space-x-4">
            <Button onClick={onOpenChange}>Adicionar transação</Button>
            <Button onClick={onOpenChangeTransfer}>Fazer transferência</Button>
          </div>
        </div>
        <TableTransaction />
        <TableDeposits />
      </div>

      <AddTransactionDialog open={isOpen} onOpenChange={onOpenChange} />
      <TransferTransactionDialog open={isOpenTransfer} onOpenChange={onOpenChangeTransfer} />
    </main>
  );
}
