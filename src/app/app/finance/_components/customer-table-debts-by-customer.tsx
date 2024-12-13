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
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import LoadingAnimation from "../../_components/loading-page";
import { Checkbox } from "@/components/ui/checkbox";
import useModal from "@/hooks/use-modal";
import { MarkAsPaid } from "./mark-as-paid-dialog";

interface CustomerDebt {
  id: string;
  customerId: string;
  customerName: string;
  totalDebt: number;
  paid: boolean | null;
}

interface TableCustomersWithDebtsByCustomerProps {
  customerId: string;
}

export function TableCustomersWithDebtsByCustomerByCustomer({customerId}: TableCustomersWithDebtsByCustomerProps) {
  const [debts, setDebts] = useState<CustomerDebt[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [selectedDebt, setSelectedDebt] = useState("");

  const { isOpen, onOpenChange } = useModal();

  async function fetchCustomersWithDebts() {
    setLoading(true);
    const fetchCustomersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/customers-with-debts/${customerId}`
    );

    fetchCustomersUrl.searchParams.set("page", String(page));
    fetchCustomersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchCustomersUrl.pathname}${fetchCustomersUrl.search}`
    );

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    setDebts(data);
    setLoading(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  function handleSelectDebt(id: string) {
    setSelectedDebt(id);

    onOpenChange();
  }

  useEffect(() => {
    fetchCustomersWithDebts();
  }, [page]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <Card className="col-span-2 mt-4">
        {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            Clientes com Dívidas
          </CardTitle>
        </CardHeader> */}
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor a Receber</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debts &&
                debts.map((debt, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium truncate">
                      {debt.customerName}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {fCurrencyIntlBRL(debt.totalDebt)}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {debt.paid ? (
                        <div className="flex gap-2">
                          <p className="text-green-800">PAGO</p>
                          <Checkbox checked disabled />
                        </div>
                      ) : (
                        <Button onClick={() => handleSelectDebt(debt.id)}>
                          Marcar como pago
                        </Button>
                      )}
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
              disabled={debts.length < itemsPerPage}
              onClick={nextPage}
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>

      <MarkAsPaid
        open={isOpen}
        onOpenChange={onOpenChange}
        debtId={selectedDebt}
      />
    </>
  );
}
