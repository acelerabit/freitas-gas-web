import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import LoadingAnimation from "../../_components/loading-page";

interface SupplierDebt {
  supplierId: string;
  supplierName: string;
  totalDebt: number;
}

export function TableSuppliersWithDebts() {
  const [suppliers, setSuppliers] = useState<SupplierDebt[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  async function fetchSuppliersWithDebts() {
    setLoading(true);
    const fetchSuppliersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers`
    );

    fetchSuppliersUrl.searchParams.set("page", String(page));
    fetchSuppliersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchSuppliersUrl.pathname}${fetchSuppliersUrl.search}`
    );

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    const suppliersWithDebts = data.map((supplier: any) => ({
      supplierId: supplier._id,
      supplierName: supplier.props.name,
      totalDebt: supplier._debts
        .filter((debt: any) => !debt.paid)
        .reduce((total: number, debt: any) => total + debt.amount, 0),
    }));

    const filteredSuppliers = suppliersWithDebts.filter(
      (supplier: { totalDebt: number; }) => supplier.totalDebt > 0
    );

    setSuppliers(filteredSuppliers);
    setLoading(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    fetchSuppliersWithDebts();
  }, [page]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <Card className="col-span-2 mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Débitos a vencer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Valor a Pagar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers &&
              suppliers.map((supplier) => (
                <TableRow key={supplier.supplierId}>
                  <TableCell className="font-medium truncate">
                    {supplier.supplierName}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {fCurrencyIntlBRL(supplier.totalDebt)}
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
            Anterior
          </Button>
          <Button
            className="disabled:cursor-not-allowed"
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
