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
import GetTotalSalesForToday from "./_components/get-total-sales-for-today";

export default function MySales() {
  return (
    <main className="p-4 md:p-8 flex flex-col">
      <h1 className="text-3xl md:text-4xl font-semibold">Meu painel</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>meu painel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6 md:space-y-8">
        <MakeDeposit />
        
        <Total />

        <GetTotalSalesForToday />

        <TableSalesLastSevenDays />

        <TableDeliverymanTransactions />

        <TableDeliverymanDeposits />
      </div>
    </main>
  );
}
