'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { TableCustomersWithDebtsByCustomerByCustomer } from "../../_components/customer-table-debts-by-customer";
import { toast } from "sonner";
import { fetchApi } from "@/services/fetchApi";

interface DebtsByCustomerProps {
  params: {
    customerId: string;
  };
}

interface Customer {
  name: string;
  id: string;
}

export default function DebtsByCustomer({ params }: DebtsByCustomerProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  async function getCustomer() {
    const response = await fetchApi(`customers/${params.customerId}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    const data = await response.json();

    setCustomer({
      id: data._id,
      name: data.props.name
    });
  }

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">
        Débitos do cliente {customer?.name}
      </h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>débitos do cliente {customer?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <TableCustomersWithDebtsByCustomerByCustomer
          customerId={params.customerId}
        />
      </div>
    </main>
  );
}
