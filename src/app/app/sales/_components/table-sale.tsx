"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

import LoadingAnimation from "@/app/app/_components/loading-page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import Link from "next/link";
import { toast } from "sonner";
import { DataTable } from "./data-table-sales";
import { SearchSales } from "./search-sales";
import useModal from "@/hooks/use-modal";
import { UpdateSaleDialog } from "./edit-sale-dialog";

interface Product {
  id: string;
  type: string;
  name: string;
  status: "FULL" | "EMPTY" | "COMODATO";
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  products: Product[];
  deliveryman: {
    name: string;
  };
  paymentMethod: string;
  customer: {
    name: string;
  };
  saleType: string;
  total: number;
  date: Date;
  createdAt: string;
}

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

const saleTypes = [
  {
    name: "Vasilhame cheio",
    value: "FULL",
  },
  {
    name: "Vasilhame vazio",
    value: "EMPTY",
  },
  {
    name: "Comodato",
    value: "COMODATO",
  },
];

const saleTypesMapper = {
  FULL: "Vasilhame cheio",
  EMPTY: "Vasilhame vazio",
  COMODATO: "Comodato",
};

type SortType =
  | "createdAt"
  | "customer"
  | "saleType"
  | "total"
  | "deliveryman"
  | "paymentMethod"
  | "total"
  | "quantity";

export default function TableSale() {
  const [sales, setSales] = useState<Sale[] | []>([]);
  const [page, setPage] = useState(1);
  const [saleSelectType, setSaleSelectType] = useState("");
  const [saleId, setSaleId] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  const [orderByField, setOrderByField] = useState<SortType>("createdAt");
  const [orderDirection, setOrderDirection] = useState<"desc" | "asc">("desc");

  const itemsPerPage = 10;
  const [filter, setFilter] = useState("");
  const { user, loadingUser } = useUser();

  const { isOpen: openUpdateSale, onOpenChange: updateSaleOnOpenChange } =
    useModal();

  const handleSort = (sortField: SortType, direction: "desc" | "asc") => {
    setOrderByField(sortField);
    setOrderDirection(direction);
  };

  const handleValueChange = (newDateFilter: any) => {
    setDateFilter(newDateFilter);
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "deliveryman",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort(
                "deliveryman",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Entregador
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "deliveryman" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p>{row.original.deliveryman.name}</p>;
      },
    },
    {
      accessorKey: "products",
      header: ({ column }) => {
        return <p>Produtos</p>;
      },
      cell: ({ row }) => {
        return (
          <>
            {row.original.products.map((product, index) => (
              <p key={index}>
                {product.type} {`(x${product.quantity})`}
              </p>
            ))}
          </>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort(
                "paymentMethod",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Método de pagamento
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "paymentMethod" && (
              <span className="text-[8px]">
                {/* {column.getIsSorted() && column.getIsSorted()} */}
                {orderDirection}
              </span>
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort("customer", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Cliente
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "customer" && (
              <span className="text-[8px]">
                {/* {column.getIsSorted() && column.getIsSorted()} */}
                {orderDirection}
              </span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p>{row.original.customer.name}</p>;
      },
    },
    {
      accessorKey: "saleType",
      header: ({ column }) => {
        return <p>Tipo de venda</p>;
      },
      cell: ({ row }) => {
        return (
          <p>
            {row.original.products.map((product, index) => (
              <p key={index}>
                {product.type} {`(x${product.quantity})`} -{" "}
                {
                  saleTypesMapper[
                    product.status as "FULL" | "EMPTY" | "COMODATO"
                  ]
                }
              </p>
            ))}
          </p>
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort("total", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "total" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort(
                "createdAt",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Criado em
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "createdAt" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = new Date(row.original.createdAt);
        const formatted = new Intl.DateTimeFormat("pt-br").format(value);

        return <div>{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/app/sales/${row.original.id}`}>Ver detalhes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => {
                    setSaleId(row.original.id);
                    updateSaleOnOpenChange();
                  }}
                >
                  Editar
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  function handleFilterProjects(filter: string) {
    setPage(1);
    setFilter(filter);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  const queryData = async () => {
    const fetchSalesUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales`
    );

    if (filter) {
      fetchSalesUrl.searchParams.set("deliveryman", filter);
      fetchSalesUrl.searchParams.set("customer", filter);
    }

    if (dateFilter.startDate && dateFilter.endDate) {
      fetchSalesUrl.searchParams.set("startDate", String(dateFilter.startDate));
      fetchSalesUrl.searchParams.set("endDate", String(dateFilter.endDate));
    }

    if (saleSelectType && saleSelectType != "none") {
      fetchSalesUrl.searchParams.set("saleSelectType", saleSelectType);
    }

    fetchSalesUrl.searchParams.set("orderByField", orderByField);
    fetchSalesUrl.searchParams.set("orderDirection", orderDirection);

    fetchSalesUrl.searchParams.set("page", String(page));
    fetchSalesUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchSalesUrl.pathname}${fetchSalesUrl.search}`
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    const data: Sale[] = await response.json();

    setSales(data);
  };

  useEffect(() => {
    queryData();
  }, [filter, page, orderDirection, orderByField, dateFilter, saleSelectType]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      <div>
        <div className="w-full flex items-center justify-between">
          <SearchSales handleFilterSales={handleFilterProjects} />
        </div>
        <div className="w-full flex items-center gap-2">
          <div className="w-full md:max-w-xs my-4">
            <Datepicker
              containerClassName="relative border rounded-md border-zinc-300"
              popoverDirection="down"
              primaryColor={"blue"}
              showShortcuts={true}
              placeholder={"DD/MM/YYYY ~ DD/MM/YYYY"}
              displayFormat={"DD/MM/YYYY"}
              value={dateFilter}
              onChange={handleValueChange}
            />
          </div>
        </div>
      </div>

      <div className="relative pb-10 rounded-md">
        <DataTable
          columns={columns}
          data={sales}
          page={page}
          itemsPerPage={itemsPerPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </div>

      <UpdateSaleDialog
        saleId={saleId}
        open={openUpdateSale}
        onOpenChange={updateSaleOnOpenChange}
      />
    </div>
  );
}
