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
  PieChart,
  Pie,
  Cell
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
  expenseProportion: { category: string; percentage: number }[] | null;
  loadingExpenseProportion: boolean;
}

const SalesDashboard = ({
  salesIndicators,
  expenseIndicators,
  loadingSalesIndicators,
  loadingExpenseIndicators,
  averageDailySales,
  averageMonthlySales,
  expenseProportion,
  loadingExpenseProportion,
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
              <Card className="h-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Total de Vendas por Dia</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={salesIndicators.totalPerDay}
                      margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                    >
                      <Line
                        type="monotone"
                        strokeWidth={2}
                        dataKey="total"
                        name="Total"
                        stroke="#007BFF"
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
                        tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => dayjs(label).format("DD/MM/YYYY")} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Total de Vendas por Mês */}
              <Card className="h-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Total de Vendas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={salesIndicators.totalPerMonth.map(item => ({
                      month: getMonthName(item.month),
                      total: item.total,
                    }))}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#28A745" />
                  </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Despesas por Dia */}
              <Card className="h-auto">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Despesas por Dia</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseIndicators?.totalPerDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="createdAt" tickFormatter={(date) => dayjs(date).format('DD/MM')} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#17A2B8" />
                  </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Despesas por Mês */}
              <Card className="h-auto">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Despesas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={expenseIndicators?.totalPerMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="month" 
                        hide={true}
                      />
                      <YAxis tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }} />
                      <Tooltip 
                        formatter={(value: any) => (typeof value === "number" ? formatCurrency(value) : value)} 
                      />
                      <Line type="monotone" dataKey="total" stroke="#FF6F61" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Proporção de Despesas por Categoria */}
              {loadingExpenseProportion ? (
                <Skeleton className="h-auto w-full" />
              ) : (
                <Card className="h-auto">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Proporção de Despesas por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex items-center justify-center">
                    {expenseProportion && expenseProportion.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={expenseProportion}
                            dataKey="percentage"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label
                          >
                            {expenseProportion.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#28A745', '#FF6F61', '#17A2B8'][index % 3]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div>No data available</div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SalesDashboard;
