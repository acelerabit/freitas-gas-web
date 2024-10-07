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
import { AddProductDialog } from "./_components/add-product-dialog";
import { ProductList } from "./_components/products-list";

export default function Products() {
  const { isOpen, onOpenChange } = useModal();

  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Produtos</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>produtos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full ">
        <div className="w-full flex justify-end">
          <Button onClick={onOpenChange}>Adicionar produto</Button>
        </div>

        <div className="mt-8">
          <ProductList />
        </div>
      </div>

      <AddProductDialog open={isOpen} onOpenChange={onOpenChange} />
    </main>
  );
}
