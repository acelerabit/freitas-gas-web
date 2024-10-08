"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DecreaseProductQuantityDialog } from "./decrease-product-quantity-dialog";
import { IncreaseProductQuantityDialog } from "./increase-product-quantity-dialog";

type BottleStatus = "FULL" | "EMPTY" | "COMODATO";

type ProductType = "P3" | "P13" | "P20" | "P45";

const bottleStatusMapper = {
  FULL: 'CHEIO',
  EMPTY: 'VAZIO',
  COMODATO: 'COMODATO',
}

export interface Product {
  id: string;
  type: ProductType;
  status: BottleStatus;
  price: number;
  quantity: number;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const { isOpen: isOpenIncrease, onOpenChange: onOpenChangeIncrease } =
    useModal();
  const { isOpen: isOpenDecrease, onOpenChange: onOpenChangeDecrease } =
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

    setProducts(data);
  }

  function selectCurrentProductDecrease(product: Product) {
    setProduct(product);

    onOpenChangeDecrease();
  }

  function selectCurrentProductIncrease(product: Product) {
    setProduct(product);

    onOpenChangeIncrease();
  }

  function handleCloseDecrease() {
    setProduct(null);

    onOpenChangeDecrease();
  }

  function handleCloseIncrease() {
    setProduct(null);

    onOpenChangeDecrease();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => {
          return (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>
                  {product.type} {bottleStatusMapper[product.status]}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p>estado: {product.status}</p>
                <p>tipo: {product.type}</p>
                <p>preço: {product.price / 100}</p>
                <p>quantidade: {product.quantity}</p>

                <div className="mt-4 space-x-4">
                  <Button onClick={() => selectCurrentProductIncrease(product)}>
                    Adicionar items
                  </Button>
                  <Button onClick={() => selectCurrentProductDecrease(product)}>
                    Remover items
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {product && (
        <IncreaseProductQuantityDialog
          open={isOpenIncrease}
          onOpenChange={handleCloseIncrease}
          product={product}
        />
      )}

      {product && (
        <DecreaseProductQuantityDialog
          open={isOpenDecrease}
          onOpenChange={handleCloseDecrease}
          product={product}
        />
      )}
    </>
  );
}
