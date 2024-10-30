"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrencyInput } from "react-currency-mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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

const productTypesMapper = [
  {
    key: "P13",
    value: "P13",
  },
  {
    key: "P20",
    value: "P20",
  },
  {
    key: "P45",
    value: "P45",
  },
];

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

interface ProductType {
  id: string;
  type: string;
  quantity: number;
  price: number;
  status: string;
}

interface Customer {
  name: string;
  id: string;
}

const formSchema = z.object({
  customerId: z.string(),
  productId: z.string(),
  quantity: z.coerce
    .number()
    .min(0, "insira um numero maior ou igual a 0")
    .positive("O valor deve ser um inteiro positivo.")
    .refine((val) => !isNaN(val), "insira um numero"),
});

export function CollectRecipientDialog({
  open,
  onOpenChange,
}: AddTransactionDialogProps) {
  const { user, loadingUser } = useUser();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const { control } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const product = products.find(
      (product) =>
        product.type === values.productId && product.status === "COMODATO"
    );

    if (!product) {
      return;
    }

    const requestData = {
      customerId: values.customerId,
      productId: product.id,
      quantity: values.quantity,
    };

    console.log(requestData);

    const response = await fetchApi(`/collect`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });

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

    toast.success("Itens coletados com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    window.location.reload();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetchApi("/customers/all");
        const customersData = await customersResponse.json();
        const formattedCustomers = customersData.map(
          (customer: { id: any; props: { id: any; name: any } }) => ({
            id: customer.props.id,
            name: customer.props.name,
          })
        );
        setCustomers(formattedCustomers);

        const productsResponse = await fetchApi("/products");
        const productsData = await productsResponse.json();
        const formattedProducts = productsData.map(
          (product: {
            _id: any;
            _props: { type: any; status: any; price: any; quantity: any };
          }) => ({
            id: product._id,
            type: product._props.type,
            status: product._props.status,
            price: product._props.price / 100,
            quantity: product._props.quantity,
          })
        );
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Nova despesa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => {
                    // setFormData((prev) => ({ ...prev, customerId: value }));
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypesMapper.map((product) => (
                      <SelectItem key={product.key} value={String(product.key)}>
                        {product.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
