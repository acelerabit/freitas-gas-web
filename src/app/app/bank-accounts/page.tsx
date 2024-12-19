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
import { Button } from "@/components/ui/button";
import { CreateBankAccountDialog } from "./_components/create-bank-account-dialog";

export default function BankAccounts() {
  const { isOpen, onOpenChange } = useModal();

  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Contas bancárias</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>contas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full space-y-4">
        <div className="w-full flex items-center justify-end mb-4">
          <Button onClick={onOpenChange}> Cadastrar conta bancária</Button>
        </div>
        <div className="mt-8">
          <ListBankAccounts />
        </div>
      </div>

      <CreateBankAccountDialog open={isOpen} onOpenChange={onOpenChange} />
    </main>
  );
}
