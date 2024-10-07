import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart,
  ChevronRight,
  CreditCard,
  HandCoins,
  LayoutList,
  Menu,
  Mountain,
  ShoppingBasket,
  SquareUserRound,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { DropdownSettings } from "./dropdown-settings";
import { Notifications } from "./notifications";
import { UpgradeCard } from "./upgrade-card";

export function MainSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
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
              <Link
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
                href="/app/sales"
              >
                <HandCoins className="h-4 w-4" />
                Vendas
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/finance"
              >
                <Wallet className="h-4 w-4" />
                Financeiro
              </Link>
              <Collapsible className="grid gap-4">
                <CollapsibleTrigger className="flex items-center gap-3 rounded-lg py-2 [&[data-state=open]>svg]:rotate-90">
                  <div
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    // href="#"
                  >
                    <ShoppingBasket className="h-4 w-4" />
                    Products
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 transition-all" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-2 p-2 space-y-4 bg-gray-100 dark:bg-gray-800">
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Shoes
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Tops & T-Shirts
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Shorts
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Hoodies & Pullovers
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Pants & Tights
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Jackets & Vests
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Tracksuits
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Jordan
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Socks
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Accessories & Equipment
                      </div>
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </div>
          <div className="p-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 lg:h-[60px] justify-between lg:justify-end items-center  gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" size="icon" variant="outline">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="#"
                  >
                    <Mountain className="h-6 w-6" />
                    <span className="">Freitas Gás</span>
                  </Link>
                  <Notifications />
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <Link
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
                      href="/app/sales"
                    >
                      <Users className="h-4 w-4" />
                      Vendas
                    </Link>
                    <Collapsible className="grid gap-4">
                      <CollapsibleTrigger className="flex items-center gap-3 rounded-lg py-2 [&[data-state=open]>svg]:rotate-90">
                        <div
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                          // href="#"
                        >
                          <ShoppingBasket className="h-4 w-4" />
                          Products
                        </div>
                        <ChevronRight className="ml-auto h-5 w-5 transition-all" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-2 p-2 space-y-4 bg-gray-100 dark:bg-gray-800">
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Shoes
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Tops & T-Shirts
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Shorts
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Hoodies & Pullovers
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Pants & Tights
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Jackets & Vests
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Tracksuits
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Jordan
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Socks
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Accessories & Equipment
                            </div>
                          </Link>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </nav>
                </div>
                <UpgradeCard />
              </div>
            </SheetContent>
          </Sheet>
          <Link className="lg:hidden" href="#">
            <Mountain className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <DropdownSettings />
        </header>

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
