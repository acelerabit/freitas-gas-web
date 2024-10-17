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
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";

interface SalesIndicators {
  totalSales: number;
  totalPerDay: { createdAt: Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}

interface User {
  id: string;
  name: string;
}

interface SalesDashboardProps {
  startDate: string;
  endDate: string;
  deliverymanId: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setDeliverymanId: (id: string) => void;
  loadingSalesIndicators: boolean;
  salesIndicators: SalesIndicators | null;
  loadingUsers: boolean;
  users: User[];
  getSalesIndicators: () => void;
}

const SalesDashboard = ({
  startDate,
  endDate,
  deliverymanId,
  setStartDate,
  setEndDate,
  setDeliverymanId,
  loadingSalesIndicators,
  salesIndicators,
  loadingUsers,
  users,
  getSalesIndicators,
}: SalesDashboardProps) => {
  const getMonthName = (month: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[month - 1];
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex gap-4">
              <label>
                Data de Início:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="ml-2 p-2 border border-gray-300 rounded"
                />
              </label>
              <label>
                Data de Fim:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="ml-2 p-2 border border-gray-300 rounded"
                />
              </label>
            </div>
            <div className="flex gap-4">
              <label>
                Entregador:
                <select
                  value={deliverymanId}
                  onChange={(e) => setDeliverymanId(e.target.value)}
                  className="ml-2 p-2 border border-gray-300 rounded"
                >
                  <option value="">Todos</option>
                  {loadingUsers ? (
                    <option value="">Carregando...</option>
                  ) : (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <button
                onClick={getSalesIndicators}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Filtrar
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {loadingSalesIndicators || !salesIndicators ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Total de Vendas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">{salesIndicators.totalSales}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Total de Vendas por Dia</CardTitle>
              </CardHeader>
              <CardContent className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesIndicators.totalPerDay}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <Line
                      type="monotone"
                      strokeWidth={2}
                      dataKey="total"
                      activeDot={{
                        r: 6,
                        style: { fill: "var(--theme-primary)", opacity: 0.25 },
                      }}
                    />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(tick) => dayjs(tick).format("DD/MM/YYYY")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        dayjs(label).format("DD/MM/YYYY")
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Total de Vendas por Mês</CardTitle>
              </CardHeader>
              <CardContent className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesIndicators.totalPerMonth.map(item => ({
                      year: item.year,
                      month: getMonthName(item.month),
                      total: item.total,
                    }))}
                  >
                    <Bar dataKey="total" fill="var(--theme-primary)" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default SalesDashboard;
