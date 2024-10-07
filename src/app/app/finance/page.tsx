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
import useModal from "@/hooks/use-modal";
import { AddTransactionDialog } from "./_components/add-transaction-dialog";
import { TableTransactions } from "./_components/table-transactions";

export default function Finance() {
  const { isOpen, onOpenChange } = useModal();
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

      <div className="w-full">
        <div className="w-full flex justify-end">
          <Button onClick={onOpenChange}>Adicionar transação</Button>
        </div>
        <div>
          <TableTransactions />
        </div>
      </div>

      <AddTransactionDialog open={isOpen} onOpenChange={onOpenChange} />
    </main>
  );
}
