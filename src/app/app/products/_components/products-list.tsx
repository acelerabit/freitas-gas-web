"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DecreaseProductQuantityDialog } from "./decrease-product-quantity-dialog";
import { IncreaseProductQuantityDialog } from "./increase-product-quantity-dialog";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import { TransferProductQuantityDialog } from "./transfer-product-status-dialog";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import { UpdateProductDialog } from "./update-product-dialog";

type BottleStatus = "FULL" | "EMPTY" | "COMODATO";

export type ProductType = "P3" | "P13" | "P20" | "P45";

const bottleStatusMapper = {
  FULL: "CHEIO",
  EMPTY: "VAZIO",
  COMODATO: "COMODATO",
};

export interface Product {
  id: string;
  type: ProductType;
  status: BottleStatus;
  price: number;
  quantity: number;
}

interface Stock {
  type: ProductType;
  products: Product[];
}

export function ProductList() {
  const [stock, setStock] = useState<Stock | null>(null);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const { isOpen: isOpenIncrease, onOpenChange: onOpenChangeIncrease } =
    useModal();
  const { isOpen: isOpenDecrease, onOpenChange: onOpenChangeDecrease } =
    useModal();
  const { isOpen: isOpenUpdate, onOpenChange: onOpenChangeUpdate } = useModal();
  const { isOpen: isOpenTransfer, onOpenChange: onOpenChangeTransfer } =
    useModal();

  async function fetchProducts() {
    const response = await fetchApi("/products/list");

    if (!response.ok) {
      const respError = await response.json();

      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const data = await response.json();

    const groupedProducts = data.reduce((acc: any, product: any) => {
      const { type } = product;

      if (!acc[type]) {
        acc[type] = {
          type,
          products: [],
        };
      }

      acc[type].products.push(product);

      return acc;
    }, {} as Record<string, { type: string; products: Product[] }>);

    setStock(groupedProducts);
    setProducts(data);
  }

  function selectCurrentProductDecrease(productType: ProductType) {
    setProductType(productType);

    onOpenChangeDecrease();
  }

  function selectCurrentProductIncrease(productType: ProductType) {
    setProductType(productType);

    onOpenChangeIncrease();
  }

  function selectCurrentProductUpdate(productType: ProductType) {
    setProductType(productType);

    onOpenChangeUpdate();
  }

  function selectCurrentProductTransfer(productType: ProductType) {
    setProductType(productType);

    onOpenChangeTransfer();
  }

  function handleCloseDecrease() {
    setProductType(null);

    onOpenChangeDecrease();
  }

  function handleCloseIncrease() {
    setProductType(null);

    onOpenChangeDecrease();
  }

  function handleCloseTransfer() {
    setProductType(null);

    onOpenChangeTransfer();
  }

  function handleCloseUpdate() {
    setProductType(null);

    onOpenChangeUpdate();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(stock ?? {}).map((group) => (
          <Card key={group.type}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <p>{group.type}</p>
                <Button
                  onClick={() => selectCurrentProductUpdate(group.type)}
                  variant="ghost"
                >
                  <Pencil />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div>
                {group.products.map((product: Product) => (
                  <>
                    <div key={product.id} className="py-2">
                      <p>Estado: {bottleStatusMapper[product.status]}</p>
                      <p>Tipo: {product.type}</p>
                      <p>Preço: {fCurrencyIntlBRL(product.price / 100)}</p>
                      <p>Quantidade: {product.quantity}</p>
                    </div>
                    <Separator />
                  </>
                ))}
              </div>
              <div className="mt-4 space-x-4">
                <Button
                  onClick={() => selectCurrentProductIncrease(group.type)}
                >
                  Adicionar items
                </Button>
                <Button
                  onClick={() => selectCurrentProductDecrease(group.type)}
                >
                  Remover items
                </Button>
                <Button
                  onClick={() => selectCurrentProductTransfer(group.type)}
                >
                  Transferir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {productType && (
        <UpdateProductDialog
          open={isOpenUpdate}
          onOpenChange={handleCloseUpdate}
          productType={productType}
          products={products}
        />
      )}

      {productType && (
        <TransferProductQuantityDialog
          open={isOpenTransfer}
          onOpenChange={handleCloseTransfer}
          productType={productType}
        />
      )}

      {productType && (
        <IncreaseProductQuantityDialog
          open={isOpenIncrease}
          onOpenChange={handleCloseIncrease}
          productType={productType}
          products={products}
        />
      )}

      {productType && (
        <DecreaseProductQuantityDialog
          open={isOpenDecrease}
          onOpenChange={handleCloseDecrease}
          productType={productType}
          products={products}
        />
      )}
    </>
  );
}
