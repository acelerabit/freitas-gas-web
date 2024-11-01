"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BaggageClaim,
  BarChart,
  Barcode,
  Cylinder,
  HandCoins,
  Megaphone,
  Menu,
  Mountain,
  SquareGanttChart,
  SquareUserRound,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { ActiveLink } from "./active-link";
import { DropdownSettings } from "./dropdown-settings";
import LoadingAnimation from "./loading-page";
import { Notifications } from "./notifications";
import { routes } from "./routes";
import { useUser } from "@/contexts/user-context";

export function MainSidebar({ children }: { children: ReactNode }) {
  const { user, loadingUser } = useUser();

  if (loadingUser || !user) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-[280px] lg:shrink-0 lg:border-r lg:bg-gray-100/40 lg:dark:bg-gray-800/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Mountain className="h-6 w-6" />
              <span className="">Freitas Gás</span>
            </Link>
            <Notifications />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {/* <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/profile"
              >
                <SquareUserRound className="h-4 w-4" />
                Profile
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/dashboard"
              >
                <BarChart className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/users"
              >
                <Users className="h-4 w-4" />
                Usuários
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/customers"
              >
                <Users className="h-4 w-4" />
                Clientes
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/finance"
              >
                <Wallet className="h-4 w-4" />
                Financeiro
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/my-sales"
              >
                <HandCoins className="h-4 w-4" />
                Meu painel
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/sales"
              >
                <HandCoins className="h-4 w-4" />
                Vendas
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/expense"
              >
                <Barcode className="h-4 w-4" />
                Despesas
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/products"
              >
                <SquareGanttChart className="h-4 w-4" />
                Estoque
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/supplier"
              >
                <BaggageClaim className="h-4 w-4" />
                Fornecedores
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/collect"
              >
                <Cylinder className="h-4 w-4" />
                Coletar vasilhame
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/notifications"
              >
                <Megaphone className="h-4 w-4" />
                Notificações
              </Link> */}
              {routes(user).map((route) => {
                return (
                  <ActiveLink
                    key={route.href}
                    title={route.title}
                    href={route.href}
                    icon={route.icon}
                  />
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 sm:h-16 justify-between items-center gap-2 sm:gap-4 border-b bg-gray-100/40 px-4 sm:px-6 dark:bg-gray-800/40">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="sm:hidden" size="icon" variant="outline">
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="max-w-[250px]">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 sm:px-6">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="#"
                  >
                    <Mountain className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="">Freitas Gás</span>
                  </Link>
                  <Notifications />
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-3 sm:px-4 text-sm font-medium">
                    {routes(user).map((route) => {
                      return (
                        <ActiveLink
                          key={route.href}
                          title={route.title}
                          href={route.href}
                          icon={route.icon}
                        />
                      );
                    })}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link className="sm:hidden" href="#">
            <Mountain className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <DropdownSettings />
        </header>

        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
