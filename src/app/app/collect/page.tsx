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
import { CollectRecipientDialog } from "./_components/collect-recipient";
import { TableCollects } from "./_components/collects-table";

export default function Collect() {
  const { isOpen, onOpenChange } = useModal();
  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Coletas</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>coletar vasilhame</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full space-y-8">
        <div className="w-full flex justify-end">
          <Button onClick={onOpenChange}>Informar coleta</Button>
        </div>
        <div>
          <TableCollects />
        </div>
      </div>

      <CollectRecipientDialog open={isOpen} onOpenChange={onOpenChange} />
    </main>
  );
}
