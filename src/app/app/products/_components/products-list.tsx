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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/contexts/user-context";

type BottleStatus = "FULL" | "EMPTY" | "COMODATO";

export type ProductType = "P13" | "P20" | "P45";

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

type Prices = Record<ProductType, Record<BottleStatus, number>>;

const statusPriority: { [key: string]: number } = {
  FULL: 1,
  EMPTY: 2,
  COMODATO: 3,
};

export function ProductList() {
  const { user, loadingUser } = useUser();
  const [stock, setStock] = useState<Stock | null>(null);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [prices, setPrices] = useState<Prices>({
    P13: { EMPTY: 0, FULL: 0, COMODATO: 0 },
    P20: { EMPTY: 0, FULL: 0, COMODATO: 0 },
    P45: { EMPTY: 0, FULL: 0, COMODATO: 0 },
  });

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

    const groupedProducts = data.reduce(
      (acc: any, product: any) => {
        const { type } = product;

        if (!acc[type]) {
          acc[type] = {
            type,
            products: [],
          };
        }

        acc[type].products.push(product);

        return acc;
      },
      {
        P13: { type: "P13", products: [] },
        P20: { type: "P20", products: [] },
        P45: { type: "P45", products: [] },
      } as Record<string, { type: string; products: Product[] }>
    );

    const pricesByTypeAndStatus = data.reduce(
      (
        acc: Record<ProductType, Record<BottleStatus, number>>,
        product: Product
      ) => {
        const { type, status, price } = product;

        // Inicializa o agrupamento por tipo se não existir
        if (!acc[type]) {
          acc[type] = {
            EMPTY: 0,
            FULL: 0,
            COMODATO: 0,
          };
        }

        // Adiciona o preço ao status correspondente
        acc[type][status] += price;

        return acc;
      },
      {} as Record<ProductType, Record<BottleStatus, number>>
    );

    setPrices(pricesByTypeAndStatus);
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

  function selectCurrentProductUpdate() {
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
    onOpenChangeUpdate();
  }

  function calculateTotal(products: Product[]) {
    const result = products.reduce((acc: any, product: any) => {
      const { quantity } = product;

      acc += quantity;

      return acc;
    }, 0);

    return result;
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
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div>
                <p className="text-xl">
                  Total: {calculateTotal(group.products)}
                </p>
                {group.products.sort((a: Product, b: Product) => statusPriority[a.status] - statusPriority[b.status]).map((product: Product) => (
                  <>
                    <div key={product.id} className="py-2">
                      <p>Estado: {bottleStatusMapper[product.status]}</p>
                      {/* <p>Tipo: {product.type}</p> */}
                      {/* <p>Preço: {fCurrencyIntlBRL(product.price / 100)}</p> */}
                      <p>Quantidade: {product.quantity}</p>
                    </div>
                    <Separator />
                  </>
                ))}
              </div>
              {user?.role === "ADMIN" && (
                <div className="mt-4 space-x-4">
                  <Button onClick={() => selectCurrentProductIncrease(group.type)}>
                    Adicionar items
                  </Button>
                  <Button onClick={() => selectCurrentProductDecrease(group.type)}>
                    Remover items
                  </Button>
                  <Button onClick={() => selectCurrentProductTransfer(group.type)}>
                    Transferir
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <p>Preços</p>

              {user?.role === "ADMIN" && (
                <Button onClick={() => onOpenChangeUpdate()} variant="ghost">
                  <Pencil />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto / Tipo</TableHead>
                <TableHead>Troca de gás</TableHead>
                <TableHead>Vasilhame + gás</TableHead>
                <TableHead>Comodato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices &&
                Object.entries(prices).map(([key, value], index) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell className="font-medium truncate">
                      {fCurrencyIntlBRL(value.EMPTY / 100)}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {fCurrencyIntlBRL(value.FULL / 100)}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {fCurrencyIntlBRL(value.COMODATO / 100)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UpdateProductDialog
        open={isOpenUpdate}
        onOpenChange={handleCloseUpdate}
        products={products}
      />

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
