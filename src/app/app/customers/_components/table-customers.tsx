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
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    street: false,
    number: false,
    district: false,
    city: false,
    state: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  function validateFields() {
    const newErrors = {
      name: !newCustomer.name,
      email: !newCustomer.email || !emailRegex.test(newCustomer.email),
      phone: !newCustomer.phone,
      street: !newCustomer.street,
      number: !newCustomer.number,
      district: !newCustomer.district,
      city: !newCustomer.city,
      state: !newCustomer.state,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }

  async function handleCreateCustomer() {
    if (!validateFields()) {
      return;
    }

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
        creditBalance: 0,
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
      });
      setErrors({
        name: false,
        email: false,
        phone: false,
        street: false,
        number: false,
        district: false,
        city: false,
        state: false,
      });
    }
  }
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d)/, "($1) $2-$3");
    }
  };

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
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs">Campo obrigatório</p>}

              <Input
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs">Campo obrigatório</p>}

              <Input
                placeholder="Telefone"
                value={formatPhone(newCustomer.phone)}
                onChange={(e) => {
                  const { value } = e.target;
                  if (value.replace(/\D/g, "").length <= 11) {
                    setNewCustomer({ ...newCustomer, phone: value });
                  }
                }}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-xs">Campo obrigatório</p>}

              <Input
                placeholder="Rua"
                value={newCustomer.street}
                onChange={(e) => setNewCustomer({ ...newCustomer, street: e.target.value })}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && <p className="text-red-500 text-xs">Campo obrigatório</p>}

              <Input
                placeholder="Número"
                value={newCustomer.number}
                onChange={(e) => setNewCustomer({ ...newCustomer, number: e.target.value })}
                className={errors.number ? "border-red-500" : ""}
              />
              {errors.number && <p className="text-red-500 text-xs">Campo obrigatório</p>}

              <Input
                placeholder="Bairro"
                value={newCustomer.district}
                onChange={(e) => setNewCustomer({ ...newCustomer, district: e.target.value })}
                className={errors.district ? "border-red-500" : ""}
              />
              {errors.district && <p className="text-red-500 text-xs">Campo obrigatório</p>}

              <Input
                placeholder="Cidade"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-xs">Campo obrigatório</p>}

              <Input
                placeholder="Estado"
                value={newCustomer.state}
                onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-red-500 text-xs">Campo obrigatório</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCustomer}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto max-w-full">
            <Table className="min-w-full">
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
                {loadingCustomers ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">Nenhum cliente encontrado.</TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.street}</TableCell>
                      <TableCell>{customer.number}</TableCell>
                      <TableCell>{customer.district}</TableCell>
                      <TableCell>{customer.city}</TableCell>
                      <TableCell>{customer.state}</TableCell>
                      <TableCell>{customer.creditBalance ?? 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link href={`/customers/${customer.id}`}>Editar</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button variant="destructive">Remover</Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="w-full flex gap-2 items-center justify-end">
            <Button
              className="disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={previousPage}
            >
              Anterior
            </Button>
            <Button
              className="disabled:cursor-not-allowed"
              disabled={customers.length < itemsPerPage}
              onClick={nextPage}
            >
              Próxima
            </Button>
          </div>
      </CardContent>
    </Card>
  );
}
