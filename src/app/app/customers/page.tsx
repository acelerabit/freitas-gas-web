import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TableCustomers } from "./_components/table-customers";
import { OnlyRolesCanAccess } from "../_components/only-who-can-access";

export default function Customers() {
  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN"]}>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Clientes</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>customers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <TableCustomers />
        </div>
      </main>
    </OnlyRolesCanAccess>
  );
}
