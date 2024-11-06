"use client";

import useModal from "@/hooks/use-modal";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ListBankAccounts } from "./_components/list-bank-accounts";

export default function BankAccounts() {
  const { isOpen, onOpenChange } = useModal();

  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Contas bancárias</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>contas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full space-y-4">
        <div className="mt-8">
          <ListBankAccounts />
        </div>
      </div>
    </main>
  );
}
