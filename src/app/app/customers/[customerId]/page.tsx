"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchApi } from "@/services/fetchApi";
import { Send } from "lucide-react";
import { toast } from "sonner";
import LoadingAnimation from "../../_components/loading-page";
import { UpdateCustomerForm } from "./update-customer-form";
import { useEffect, useState } from "react";
import useModal from "@/hooks/use-modal";

interface CustomerProps {
  params: {
    customerId: string;
  };
}

interface Customer {
  props: {
    id: string;
    name: string;
    email: string;
    phone: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    creditBalance?: number;
  };
}

export default function Customer({ params }: CustomerProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isOpen, onOpenChange } = useModal();

  async function getCustomer() {
    const response = await fetchApi(`/customers/${params.customerId}`);

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

    setCustomer(data);
    setLoadingCustomer(false);
  }

  async function handleDeleteCustomer() {
    setIsDeleting(true);
    const response = await fetchApi(`/customers/${params.customerId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setIsDeleting(false);
      return;
    }

    toast.success("Cliente excluído com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.href = "/app/customers";
  }

  useEffect(() => {
    getCustomer();
  }, []);

  if (loadingCustomer || !customer) {
    return <LoadingAnimation />;
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{customer?.props.name}</h1>
      </div>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/customers">Clientes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{customer?.props.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue="account">
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
                <CardDescription>
                  Dados do cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateCustomerForm customer={customer} />
              </CardContent>
            </Card>

            <div className="max-w-96">
              <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Deletar cliente</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Você tem certeza que deseja excluir o cliente?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente e removerá seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteCustomer}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Excluindo..." : "Continuar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
