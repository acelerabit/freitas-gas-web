import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TableUsers } from "./_components/table-users";
import { OnlyRolesCanAccess } from "../_components/only-who-can-access";

export default function Users() {
  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN"]}>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Usuários</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <TableUsers />
        </div>
      </main>
    </OnlyRolesCanAccess>
  );
}
