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
  Cell,
  CartesianGrid,
  Legend,
  Label 
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

interface SalesVsExpenses {
  totalSales: { year: number; month: number; total: number }[];
  totalExpenses: { year: number; month: number; total: number }[];
}
interface TotalFiado {
  total: number;
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
  salesVsExpenses: SalesVsExpenses;
  grossProfit: number | null;
  loadingGrossProfit: boolean;
  totalFiado: TotalFiado | null;
}

const SalesDashboard = ({
  salesIndicators,
  expenseIndicators,
  salesVsExpenses,
  loadingSalesIndicators,
  loadingExpenseIndicators,
  averageDailySales,
  averageMonthlySales,
  expenseProportion,
  loadingExpenseProportion,
  grossProfit,
  loadingGrossProfit,
  totalFiado
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

  const monthlyData = salesIndicators?.totalPerMonth.reduce((acc, entry) => {
    const monthYear = `${getMonthName(entry.month)} ${entry.year}`;
  
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, total: 0 };
    }
    acc[monthYear].total += Number(entry.total);
  
    return acc;
  }, {} as { [key: string]: { month: string; total: number } }) || {};
  
  const monthlyDataArray = Object.values(monthlyData);

  const monthlyExpensesData = expenseIndicators?.totalPerMonth.reduce((acc, entry) => {
    const monthYear = `${getMonthName(entry.month)} ${entry.year}`;
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, total: 0 };
    }
    acc[monthYear].total += entry.total;
    return acc;
  }, {} as { [key: string]: { month: string; total: number } }) || {};
  
  const monthlyExpensesDataArray = Object.values(monthlyExpensesData);  

  const totalSale = salesVsExpenses.totalSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalExpense = salesVsExpenses.totalExpenses.reduce((acc, expense) => acc + expense.total, 0);

  const totalData = [{ label: "Total", totalSale, totalExpense }];

  const totalSales = salesIndicators?.totalSales || 0;
  const totalExpenses = expenseIndicators?.totalExpenses || 0;

  const gross = totalSales - totalExpenses;
  const isProfitPositive = gross > 0;

  return (
    <>
      <div className="grid gap-4">
        {loadingSalesIndicators || !salesIndicators ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card de Total de Vendas */}
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

              {/* Card de Lucro Bruto */}
              <Card className={isProfitPositive ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg h-full" : "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg h-full"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Lucro Bruto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {grossProfit !== null ? formatCurrency(grossProfit) : formatCurrency(0)}
                  </div>
                </CardContent>
              </Card>
              {/* Card de Vendas a Receber */}
              <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Vendas a Receber</CardTitle>
                  <CurrencyDollarIcon className="w-6 h-6" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                  {totalFiado ? formatCurrency(totalFiado.total) : formatCurrency(0)}
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
                      <YAxis tickFormatter={(value) => formatCurrency(value / 100)} tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }} />
                      <Tooltip formatter={(value: number) => formatCurrency(value / 100)} labelFormatter={(label) => dayjs(label).format("DD/MM/YYYY")} />
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
                    <BarChart data={monthlyDataArray}>
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                        tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                      />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
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
                    <LineChart
                      data={expenseIndicators?.totalPerDay}
                      margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                    >
                      <Line
                        type="monotone"
                        strokeWidth={2}
                        dataKey="total"
                        name="Total"
                        stroke="#17A2B8"
                        activeDot={{
                          r: 6,
                          style: { fill: "var(--theme-primary)", opacity: 0.25 },
                        }}
                      />
                      <XAxis
                        dataKey="createdAt"
                        tickFormatter={(tick) => dayjs(tick).format("DD/MM/YYYY")}
                        tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => dayjs(label).format("DD/MM/YYYY")}
                      />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                        tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Despesas por Mês */}
              <Card className="h-auto">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Despesas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyExpensesDataArray} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value)} 
                        tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }} 
                      />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="total" fill="#FF6F61" />
                    </BarChart>
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
                  <CardContent className="h-full flex flex-col items-center justify-center">
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
                            label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                          >
                            {expenseProportion.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#28A745', '#FF6F61', '#17A2B8'][index % 3]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => `${(value * 100).toFixed(2)}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div>No data available</div>
                    )}
                    {expenseProportion && expenseProportion.length > 0 && (
                      <div className="flex flex-col items-center mt-4">
                        {expenseProportion.map((entry, index) => (
                          <div key={index} className="flex items-center">
                            <div
                              className="w-4 h-4 mr-2"
                              style={{ backgroundColor: ['#28A745', '#FF6F61', '#17A2B8'][index % 3] }}
                            />
                            <span className="text-sm">
                              {entry.category}: {(entry.percentage * 100).toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Gráfico de Receita x Despesa */}
              <Card className="h-auto">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Despesas e Vendas Totais</CardTitle>
                </CardHeader>
                <CardContent className="h-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={totalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="label" />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value)} 
                        tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }} 
                      />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="totalSale" fill="#28A745" name="Total de Vendas" />
                      <Bar dataKey="totalExpense" fill="#FF6F61" name="Total de Despesas" />
                    </BarChart>
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