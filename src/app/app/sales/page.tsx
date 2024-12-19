"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TableSales } from "./_components/table-sales";
import TableSale from "./_components/table-sale";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { OnlyRolesCanAccess } from "../_components/only-who-can-access";

export default function SalesPage() {
  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN"]}>
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Vendas</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>vendas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <TableSales />
      </div>
    </main>
    </OnlyRolesCanAccess>
  );
}
