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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import useModal from "@/hooks/use-modal";
import { ConfirmDeleteTransferAccount } from "./confirm-delete-transfer-account";
import { UpdateAccountTransferDialog } from "./update-account-transfer";
import { formatDateWithHours } from "@/utils/formatDate";
import Datepicker from "react-tailwindcss-datepicker";

interface Transfer {
  id: string;
  originAccountId: string;
  originAccount: {
    bank: string;
  };
  destinationAccountId: string;
  destinationAccount: {
    bank: string;
  };
  value: number;
  createdAt: string;
}
interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

export function TransferAccountTable() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [transferIdSelected, setTransferIdSelected] = useState("");

  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);

  const { isOpen, onOpenChange } = useModal();
  const { isOpen: isOpenUpdate, onOpenChange: onOpenChangeUpdate } = useModal();
  const [dateFilter, setDateFilter] = useState<DateFilter>({
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });

  async function fetchTransfers() {
    setLoading(true);

    const fetchTransfersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/account-transfer`
    );

    fetchTransfersUrl.searchParams.set("page", String(page));
    fetchTransfersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    if (dateFilter.startDate) {
      fetchTransfersUrl.searchParams.set(
        "startDate",
        dateFilter.startDate.toISOString().split("T")[0]
      );
    }
  
    if (dateFilter.endDate) {
      const endDateWithTime = new Date(dateFilter.endDate);
      endDateWithTime.setHours(23, 59, 59);
      
      fetchTransfersUrl.searchParams.set(
        "endDate",
        endDateWithTime.toISOString().split("T")[0]
      );
    }

    const response = await fetchApi(
      `${fetchTransfersUrl.pathname}${fetchTransfersUrl.search}`
    );

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    setTransfers(data);
    setLoading(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  function handleOpenDelete(transferId: string) {
    setTransferIdSelected(transferId);

    onOpenChange();
  }

  function handleCloseDelete() {
    setTransferIdSelected("");

    onOpenChange();
  }

  function handleOpenUpdate(transferId: string) {
    setTransferIdSelected(transferId);

    onOpenChangeUpdate();
  }

  function handleCloseUpdate() {
    setTransferIdSelected("");

    onOpenChangeUpdate();
  }

  const handleValueChange = (value: DateFilter | null) => {
    if (value) {
      setDateFilter({
        startDate: value.startDate ? new Date(value.startDate) : null,
        endDate: value.endDate ? new Date(value.endDate) : null,
      });
    } else {
      setDateFilter({ startDate: null, endDate: null });
    }
  };

  useEffect(() => {
    if (page && itemsPerPage) {
      fetchTransfers();
    }
  }, [page, dateFilter]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <Card className="col-span-2 mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            Transferências entre contas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex items-center gap-2">
            <div className="w-full md:max-w-xs my-4">
              <Datepicker
                containerClassName="relative border rounded-md border-zinc-300"
                popoverDirection="down"
                primaryColor="blue"
                showShortcuts={true}
                placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
                displayFormat="DD/MM/YYYY"
                value={dateFilter}
                onChange={handleValueChange}
                configs={{
                  shortcuts: {
                    today: "Hoje",
                    yesterday: "Ontem",
                    past: (period) => `Últimos ${period} dias`,
                    currentMonth: "Mês atual",
                    pastMonth: "Último mês",
                  },
                  footer: {
                    cancel: "Cancelar",
                    apply: "Aplicar",
                  },
                }}
                i18n="pt-br"
                readOnly
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conta de origem</TableHead>
                <TableHead>Conta de destino</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium truncate">
                    {transfer.originAccount.bank}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {transfer.destinationAccount.bank}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {fCurrencyIntlBRL(transfer.value / 100)}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {formatDateWithHours(transfer.createdAt)}
                  </TableCell>

                  <TableCell className="font-medium truncate">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="space-y-2">
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Button
                            onClick={() => handleOpenUpdate(transfer.id)}
                            className="w-full"
                          >
                            Editar
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Button
                            onClick={() => handleOpenDelete(transfer.id)}
                            variant="destructive"
                            className="w-full"
                          >
                            Deletar
                          </Button>
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
              Anterior
            </Button>
            <Button
              className="disabled:cursor-not-allowed"
              disabled={transfers.length < itemsPerPage}
              onClick={nextPage}
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDeleteTransferAccount
        open={isOpen}
        onOpenChange={handleCloseDelete}
        transferAccountId={transferIdSelected}
      />

      <UpdateAccountTransferDialog
        open={isOpenUpdate}
        onOpenChange={handleCloseUpdate}
        transferAccountId={transferIdSelected}
      />
    </>
  );
}
