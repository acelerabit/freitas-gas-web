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
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import useModal from "@/hooks/use-modal";
import { MarkAllAsPaid } from "./mark-all-as-paid";

interface CustomerDebt {
  customerId: string;
  customerName: string;
  totalDebt: number;
  paid: boolean;
  sales: {id: string, paid: boolean}[]
}

export function TableCustomersTotalWithDebts() {
  const [customers, setCustomers] = useState<CustomerDebt[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const { isOpen, onOpenChange } = useModal();

  async function fetchCustomersWithDebts() {
    setLoading(true);
    const fetchCustomersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/customers-with-debts-total`
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

    setCustomers(data);
    setLoading(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  function handleSelectDebt(id: string) {
    setSelectedCustomer(id);

    onOpenChange();
  }

  useEffect(() => {
    fetchCustomersWithDebts();
  }, [page]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <Card className="col-span-2 mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Clientes com Dívidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor a Receber</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers &&
              customers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium truncate">
                    {customer.customerName}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {fCurrencyIntlBRL(customer.totalDebt)}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {customer.sales.filter(sale => !sale.paid).length === 0 ? (
                      <div className="flex gap-2">
                        <p className="text-green-800">PAGO</p>
                        <Checkbox checked disabled />
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSelectDebt(customer.customerId)}
                      >
                        Marcar todas como pago
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    <Link
                      href={`/app/finance/debt/${customer.customerId}`}
                      className="hover:bg-slate-200 p-2 rounded-md"
                    >
                      Ver detalhes
                    </Link>
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
            disabled={customers.length < itemsPerPage}
            onClick={nextPage}
          >
            Próxima
          </Button>
        </div>

        <MarkAllAsPaid
          open={isOpen}
          onOpenChange={onOpenChange}
          customerId={selectedCustomer}
        />
      </CardContent>
    </Card>
  );
}
