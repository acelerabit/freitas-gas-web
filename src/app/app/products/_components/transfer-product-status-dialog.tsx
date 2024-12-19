"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrencyInput } from "react-currency-mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Product, ProductType } from "./products-list";

const BottleStatusSchema = z.enum(["FULL", "EMPTY", "COMODATO"]);

const bottleStatusOptions = [
  {
    key: "FULL",
    value: "Cheio",
  },
  { key: "EMPTY", value: "Vazio" },
  { key: "COMODATO", value: "Comodato" },
];

interface TransferProductQuantityDialogProps {
  open: boolean;
  onOpenChange: () => void;
  productType: ProductType
}

const formSchema = z.object({
  productFromStatus: BottleStatusSchema,
  productToStatus: BottleStatusSchema,
  quantity: z.coerce.number().min(0, "Insira um numero maior ou igual a 0"),
});

export function TransferProductQuantityDialog({
  open,
  onOpenChange,
  productType
}: TransferProductQuantityDialogProps) {
  const { user, loadingUser } = useUser();
  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
    },
  });

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const requestData = {
      quantity: values.quantity,
    };

    const productFrom = products.find(
      (product) =>
        product.type === productType && product.status === values.productFromStatus
    );

    if (!productFrom) {
      toast.error("Produto de partida não encontrado", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    const productTo = products.find(
      (product) =>
        product.type === productType && product.status === values.productToStatus
    );

    if (!productTo) {
      toast.error("Produto de chegada não encontrado", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    const response = await fetchApi(
      `/products/productFrom/${productFrom.id}/productTo/${productTo.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(requestData),
      }
    );

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

    toast.success("Estoque do produto atualizado com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    window.location.reload();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!user) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir items do tipo {productType}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="productFromStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de origem</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado do produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bottleStatusOptions.map((bottleStatus) => (
                        <SelectItem
                          key={bottleStatus.key}
                          value={bottleStatus.key}
                        >
                          {bottleStatus.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productToStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de destino</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado do produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bottleStatusOptions.map((bottleStatus) => (
                        <SelectItem
                          key={bottleStatus.key}
                          value={bottleStatus.key}
                        >
                          {bottleStatus.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="quantidade"
                      {...field}
                      value={field.value}
                      type="number"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end">
              <Button className="mt-4" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
