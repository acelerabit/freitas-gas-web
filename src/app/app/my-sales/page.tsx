import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Total } from "./_components/total";
import { TableDeliverymanTransactions } from "./_components/table-deliveryman-transactions";
import { TableSalesLastSevenDays } from "./_components/table-sales-last-seven-days";
import { MakeDeposit } from "./_components/make-deposit";
import { TableDeliverymanDeposits } from "./_components/table-deliveryman-deposits";

export default function MySales() {
  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Minhas vendas</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>minhas vendas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-8">
        <MakeDeposit />
        
        <Total />

        <TableSalesLastSevenDays />

        <TableDeliverymanTransactions />

        <TableDeliverymanDeposits />

      </div>
    </main>
  );
}
