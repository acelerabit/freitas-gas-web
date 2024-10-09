"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { EditCustomerDialog } from "./edit-customer-dialog";
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import CreateCustomerDialog from "./create-customer-dialog";
import { fetchApi } from "@/services/fetchApi";

export interface Customer {
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
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  async function getCustomers() {
    setLoadingCustomers(true);
    try {
      const fetchCustomersUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`);
      fetchCustomersUrl.searchParams.set("page", String(page));
      fetchCustomersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

      const response = await fetchApi(`${fetchCustomersUrl.pathname}${fetchCustomersUrl.search}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar clientes");
      }

      const data = await response.json();
      setCustomers(data.map((customer: any) => customer.props));
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoadingCustomers(false);
    }
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  useEffect(() => {
    getCustomers();
  }, [page]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Clientes</CardTitle>
        <CreateCustomerDialog onCreate={getCustomers} />
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
                          <DropdownMenuItem asChild>
                            <EditCustomerDialog customer={customer} onCustomerUpdated={getCustomers} />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteCustomerDialog customerId={customer.id} onCustomerDeleted={getCustomers} />
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
          <Button disabled={page === 1} onClick={previousPage}>Anterior</Button>
          <Button disabled={customers.length < itemsPerPage} onClick={nextPage}>Próxima</Button>
        </div>
      </CardContent>
    </Card>
  );
}
