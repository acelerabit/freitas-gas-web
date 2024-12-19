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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnlyRolesCanAccess } from "../_components/only-who-can-access";

export default function Finance() {
  const { isOpen, onOpenChange } = useModal();
  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN"]}>
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Despesas</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>despesa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full">
        
        <div className="w-full flex justify-end">
          <Button onClick={onOpenChange}>Adicionar despesa</Button>
        </div>
        <div>
          <TableTransactions />
        </div>
      </div>

      <AddTransactionDialog open={isOpen} onOpenChange={onOpenChange} />
    </main>
    </OnlyRolesCanAccess>

  );
}
