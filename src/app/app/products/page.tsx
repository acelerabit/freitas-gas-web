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
import { Button } from "@/components/ui/button";
import { ProductList } from "./_components/products-list";
import { AddProductDialog } from "./_components/add-product-dialog";
import { Stock } from "./_components/stock";
import { Separator } from "@/components/ui/separator";
import { TransferProductQuantityDialog } from "./_components/transfer-product-status-dialog";

export default function Products() {
  const { isOpen, onOpenChange } = useModal();



  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Estoque</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>estoque</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full space-y-4">
        {/* <div className="w-full flex justify-end gap-4">
          <Button onClick={onOpenChange}>Adicionar produto</Button>
          
        </div> */}

        <div className="mt-8">
          <ProductList />
        </div>

        <div>
          <Stock />
        </div>
      </div>

      

      <AddProductDialog open={isOpen} onOpenChange={onOpenChange} />
    </main>
  );
}
