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
  debts: {
    id: string;
    amount: number;
    dueDate: string;
    paid: boolean;
  }[]; 
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
      debts: supplier._debts.filter((debt: any) => !debt.paid),
    }));

    setSuppliers(suppliersWithDebts);
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

  const today = new Date();

  return (
    <Card className="col-span-2 mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Débitos com fornecedores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Valor a Pagar</TableHead>
              <TableHead>Data de Vencimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) =>
              supplier.debts.map((debt) => {
                const dueDate = new Date(debt.dueDate);
                const isDueOrToday = dueDate <= today;

                return (
                  <TableRow
                    key={debt.id}
                    className={isDueOrToday ? "bg-orange-200" : ""}
                  >
                    <TableCell className="font-medium truncate">
                      {supplier.supplierName}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {fCurrencyIntlBRL(debt.amount / 100)}
                    </TableCell>
                    <TableCell
                      className={`font-medium truncate ${
                        isDueOrToday ? "text-orange-600" : ""
                      }`}
                    >
                      {dueDate.toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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
