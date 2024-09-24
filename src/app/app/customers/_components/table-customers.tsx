"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { fetchApi } from "@/services/fetchApi";
import Link from "next/link";

interface Customer {
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
  createdAt: Date;
  updatedAt: Date;
}

export function TableCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    creditBalance: 0,
  });

  interface CustomerResponse {
    _id: string;
    props: Customer;
  }

  async function getCustomers() {
    setLoadingCustomers(true);
    const fetchCustomersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`
    );
  
    fetchCustomersUrl.searchParams.set("page", String(page));
    fetchCustomersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));
  
    const response = await fetchApi(
      `${fetchCustomersUrl.pathname}${fetchCustomersUrl.search}`
    );
  
    if (!response.ok) {
      setLoadingCustomers(false);
      return;
    }
  
    const data: CustomerResponse[] = await response.json();

    const customersList = data.map((customer) => ({
        ...customer.props,
      }));
    setCustomers(customersList);
    setLoadingCustomers(false);
  }

  async function handleCreateCustomer() {
    const response = await fetchApi("/customers", {
      method: "POST",
      body: JSON.stringify({
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        street: newCustomer.street,
        number: newCustomer.number,
        district: newCustomer.district,
        city: newCustomer.city,
        state: newCustomer.state,
        creditBalance: newCustomer.creditBalance || 0,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      await getCustomers();
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        creditBalance: 0,
      });
    }
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    getCustomers();
  }, [page]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Clientes</CardTitle>
        <Dialog>
          <DialogTrigger>
            <Button>Cadastrar Cliente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} 
              />
              <Input
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
              <Input
                placeholder="Telefone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
              <Input
                placeholder="Rua"
                value={newCustomer.street}
                onChange={(e) => setNewCustomer({ ...newCustomer, street: e.target.value })}
              />
              <Input
                placeholder="Número"
                value={newCustomer.number}
                onChange={(e) => setNewCustomer({ ...newCustomer, number: e.target.value })}
              />
              <Input
                placeholder="Bairro"
                value={newCustomer.district}
                onChange={(e) => setNewCustomer({ ...newCustomer, district: e.target.value })}
              />
              <Input
                placeholder="Cidade"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
              />
              <Input
                placeholder="Estado"
                value={newCustomer.state}
                onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
              />
              <Input
                placeholder="Saldo de crédito"
                type="number"
                value={newCustomer.creditBalance}
                onChange={(e) => setNewCustomer({ ...newCustomer, creditBalance: Number(e.target.value) })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCustomer}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableCaption>Listagem de todos os clientes</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Rua</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Saldo de crédito</TableHead>
                    <TableHead>Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers &&
                    customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell className="font-medium truncate">{customer.name}</TableCell>
                        <TableCell className="font-medium truncate">{customer.email}</TableCell>
                        <TableCell className="font-medium truncate">{customer.phone}</TableCell>
                        <TableCell className="font-medium truncate">{customer.street}</TableCell>
                        <TableCell className="font-medium truncate">{customer.number}</TableCell>
                        <TableCell className="font-medium truncate">{customer.district}</TableCell>
                        <TableCell className="font-medium truncate">{customer.city}</TableCell>
                        <TableCell className="font-medium truncate">{customer.state}</TableCell>
                        <TableCell className="font-medium truncate">{customer.creditBalance}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                            <EllipsisVertical className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href={`/app/customers/${customer.id}`}>Ver cliente</Link>
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
            </TableBody>

        </Table>
        <div className="w-full flex gap-2 items-center justify-end">
          <Button
            className="disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={previousPage}
          >
            Previous
          </Button>
          <Button
            className="disabled:cursor-not-allowed"
            disabled={customers.length < itemsPerPage}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
