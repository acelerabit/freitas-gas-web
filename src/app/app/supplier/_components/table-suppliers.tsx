"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { fetchApi } from "@/services/fetchApi";
import EditSupplierDialog from "./edit-supplier-dialog";
import { DeleteSupplierDialog } from "./delete-supplier";
import Link from "next/link";

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  totalUnpaidDebts: number;
}

export function TableSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  async function getSuppliers() {
    setLoadingSuppliers(true);
    try {
      const fetchSuppliersUrl = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers`
      );
      fetchSuppliersUrl.searchParams.set("page", String(page));
      fetchSuppliersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

      const response = await fetchApi(
        `${fetchSuppliersUrl.pathname}${fetchSuppliersUrl.search}`
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar fornecedores");
      }

      const data = await response.json();
      setSuppliers(
        data.map((supplier: any) => ({
          id: supplier._id,
          name: supplier.props.name,
          email: supplier.props.email,
          phone: supplier.props.phone,
          createdAt: supplier.props.createdAt,
          updatedAt: supplier.props.updatedAt,
          totalUnpaidDebts: supplier._debts
            .filter((debt: any) => !debt.paid)
            .reduce((total: number, debt: any) => total + debt.amount, 0)
            .toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    } finally {
      setLoadingSuppliers(false);
    }
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  useEffect(() => {
    getSuppliers();
  }, [page]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Fornecedores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto max-w-full">
          <Table className="min-w-full">
            <TableCaption>Listagem de todos os fornecedores</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Total Débitos Não Pagos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingSuppliers ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum fornecedor encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.totalUnpaidDebts}</TableCell>
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
                          <Link href={`supplier/${supplier.id}`} passHref>
                            <Button variant="ghost">Ver Débitos</Button>
                          </Link>
                          <EditSupplierDialog
                            supplier={supplier}
                            onUpdate={getSuppliers}
                          />
                          <DeleteSupplierDialog
                            supplierId={supplier.id}
                            onSupplierDeleted={getSuppliers}
                          />
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
          <Button disabled={page === 1} onClick={previousPage}>
            Anterior
          </Button>
          <Button
            disabled={suppliers.length < itemsPerPage}
            onClick={nextPage}
          >
            Próxima
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
