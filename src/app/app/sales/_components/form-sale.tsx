"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const saleFormSchema = z.object({
  id: z.string().optional(),
  product: z.string().min(1, { message: "O produto é obrigatório" }),
  quantity: z.number().min(1, { message: "A quantidade deve ser maior que 0" }),
  deliveryman: z.string().min(1, { message: "O entregador é obrigatório" }),
  total: z.number().min(0, { message: "O total deve ser maior ou igual a 0" }),
  date: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleFormSchema>;

interface FormSaleProps {
  sale?: SaleFormData;
}

const mockSale: SaleFormData = {
  id: "1",
  product: "Produto Exemplo",
  quantity: 3,
  deliveryman: "Entregador Exemplo",
  total: 150.00,
  date: new Date().toISOString().split("T")[0],
};

export function FormSale({ sale = mockSale }: FormSaleProps) {
  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      id: sale.id,
      product: sale.product,
      quantity: sale.quantity,
      deliveryman: sale.deliveryman,
      total: sale.total,
      date: sale.date,
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: SaleFormData) {
    setLoading(true);

    console.log("Form submitted:", data);
    setLoading(false);
    router.push("/sales");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <FormControl>
                <Input placeholder="Produto" {...field} />
              </FormControl>
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
                <Input placeholder="Quantidade" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryman"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entregador</FormLabel>
              <FormControl>
                <Input placeholder="Entregador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total</FormLabel>
              <FormControl>
                <Input placeholder="Total" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input placeholder="Data" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {sale ? "Atualizar Venda" : "Criar Venda"}
        </Button>
      </form>
    </Form>
  );
} 