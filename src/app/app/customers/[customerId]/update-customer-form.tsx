"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const updateCustomerFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  email: z
    .string()
    .email({ message: "Formato de e-mail inválido" })
    .min(1, { message: "O email é obrigatório" }),
  phone: z.string(),
  street: z.string(),
  number: z.string(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  creditBalance: z.number().optional(),
});

type UpdateCustomerFormData = z.infer<typeof updateCustomerFormSchema>;

interface UpdateCustomerFormProps {
  customer: {
    props: UpdateCustomerFormData;
  };
}

export function UpdateCustomerForm({ customer }: UpdateCustomerFormProps) {
  const form = useForm<UpdateCustomerFormData>({
    resolver: zodResolver(updateCustomerFormSchema),
    defaultValues: {
      id: customer.props.id,
      name: customer.props.name,
      email: customer.props.email,
      phone: customer.props.phone,
      street: customer.props.street,
      number: customer.props.number,
      district: customer.props.district,
      city: customer.props.city,
      state: customer.props.state,
      creditBalance: customer.props.creditBalance ?? 0,
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateCustomer(data: UpdateCustomerFormData) {
    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    setLoading(false);

    if (!response.ok) {
      return;
    }

    router.push("/app/customers");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(updateCustomer)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Telefone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input placeholder="Rua" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="Estado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo de crédito</FormLabel>
              <FormControl>
                <Input placeholder="Saldo de crédito" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          Atualizar Cliente
        </Button>
      </form>
    </Form>
  );
}
