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
import { TableSuppliers } from "./_components/table-suppliers";
import CreateSupplierDialog from "./_components/create-supplier-dialog";

export default function Finance() {
  const { isOpen, onOpenChange } = useModal();

  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Fornecedores</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Fornecedores</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full">
        <div className="w-full flex justify-end">
          <Button onClick={onOpenChange}>Adicionar fornecedor</Button>
        </div>
        <div className="mt-8">
          <TableSuppliers />
        </div>
      </div>

      <CreateSupplierDialog open={isOpen} onOpenChange={onOpenChange} />
    </main>
  );
}
