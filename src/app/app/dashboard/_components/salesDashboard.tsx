"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

interface SalesIndicators {
  totalSales: number;
  totalPerDay: { createdAt: string | Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}
interface ExpenseIndicators {
  totalExpenses: number;
  totalPerDay: { createdAt: string | Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}

interface SalesDashboardProps {
  salesIndicators: SalesIndicators | null;
  expenseIndicators: ExpenseIndicators | null;
  loadingSalesIndicators: boolean;
  loadingExpenseIndicators: boolean;
  averageDailySales: number;
  averageMonthlySales: number;
}

const SalesDashboard = ({
  salesIndicators,
  expenseIndicators,
  loadingSalesIndicators,
  loadingExpenseIndicators,
  averageDailySales,
  averageMonthlySales,
}: SalesDashboardProps) => {
  const getMonthName = (month: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[month - 1];
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <>
      <div className="grid gap-4">
        {loadingSalesIndicators || !salesIndicators ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card de Total de Vendass */}
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Total de Vendas</CardTitle>
                  <CurrencyDollarIcon className="w-6 h-6" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {formatCurrency(salesIndicators.totalSales)}
                  </div>
                </CardContent>
              </Card>

              {/* Card de Média Diária de Vendas */}
              <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Média Diária de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {formatCurrency(averageDailySales)}
                  </div>
                </CardContent>
              </Card>

              {/* Card de Média Mensal de Vendas */}
              <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Média Mensal de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {formatCurrency(averageMonthlySales)}
                  </div>
                </CardContent>
              </Card>

              {/* Card de Total de Despesas */}
              <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Total de Despesas</CardTitle>
                  <CurrencyDollarIcon className="w-6 h-6" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {expenseIndicators ? formatCurrency(expenseIndicators.totalExpenses) : formatCurrency(0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Gráfico de Total de Vendas por Dia */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Total de Vendas por Dia</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesIndicators.totalPerDay}
                      margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                    >
                      <Line
                        type="monotone"
                        strokeWidth={2}
                        dataKey="total"
                        name="Total"
                        activeDot={{
                          r: 6,
                          style: { fill: "var(--theme-primary)", opacity: 0.25 },
                        }}
                      />
                      <XAxis
                        dataKey="createdAt"
                        tickFormatter={(tick) =>
                          typeof tick === "string" ? dayjs(tick).format("DD/MM/YYYY") : dayjs(tick).format("DD/MM/YYYY")
                        }
                      />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) =>
                          dayjs(label).format("DD/MM/YYYY")
                        }
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Total de Vendas por Mês */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Total de Vendas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesIndicators.totalPerMonth.map((item: { year: any; month: number; total: any; }) => ({
                        year: item.year,
                        month: getMonthName(item.month),
                        total: item.total,
                      }))}
                    >
                      <Bar dataKey="total" fill="var(--theme-primary)" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Despesas por Dia */}
              <Card className="h-60">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Despesas por Dia</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ResponsiveContainer>
                    <BarChart data={expenseIndicators?.totalPerDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="createdAt" tickFormatter={(date) => dayjs(date).format('DD/MM')} />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => (typeof value === "number" ? formatCurrency(value) : value)}
                        labelFormatter={(label) => dayjs(label).format("DD/MM/YYYY")}
                      />
                      <Bar dataKey="total" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Despesas por Mês */}
              <Card className="h-60">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Despesas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ResponsiveContainer>
                    <LineChart data={expenseIndicators?.totalPerMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="month" tickFormatter={(month) => getMonthName(month)} />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => (typeof value === "number" ? formatCurrency(value) : value)}
                        labelFormatter={(label) => dayjs(label).format("DD/MM/YYYY")}
                      />
                      <Line type="monotone" dataKey="total" stroke="#ff6f61" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SalesDashboard;
