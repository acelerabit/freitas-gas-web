"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import SalesDashboard from "./_components/salesDashboard";
import Filters from "./_components/filters";
import dayjs from "dayjs";

interface SalesIndicators {
  totalSales: number;
  totalPerDay: { createdAt: Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}

interface ExpenseIndicators {
  totalExpenses: number;
  totalPerDay: { createdAt: Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}

interface ExpenseProportion {
  category: string;
  percentage: number;
}

interface User {
  id: string;
  name: string;
}

export default function CardsStats() {
  const [salesIndicators, setSalesIndicators] = useState<SalesIndicators | null>(null);
  const [expenseIndicators, setExpenseIndicators] = useState<ExpenseIndicators | null>(null);
  const [loadingSalesIndicators, setLoadingSalesIndicators] = useState(true);
  const [loadingExpenseIndicators, setLoadingExpenseIndicators] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [startDate, setStartDate] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [deliverymanId, setDeliverymanId] = useState<string>("");
  const [averageDailySales, setAverageDailySales] = useState<number>(0);
  const [averageMonthlySales, setAverageMonthlySales] = useState<number>(0);
  const [loadingAverages, setLoadingAverages] = useState(true);
  const [expenseProportion, setExpenseProportion] = useState<ExpenseProportion[]>([]);
  const [loadingExpenseProportion, setLoadingExpenseProportion] = useState(true);

  async function getSalesIndicators() {
    setLoadingSalesIndicators(true);
    const fetchUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/indicators`);

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      fetchUrl.searchParams.append("endDate", endDate);
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      console.log(response);
      setSalesIndicators({ totalSales: 0, totalPerDay: [], totalPerMonth: [] });
      setLoadingSalesIndicators(false);
      return;
    }

    const data = await response.json();
    const totalSales = data?.totalSales || 0;
    const totalPerDay = data?.totalPerDay || [];
    const totalPerMonth = data?.totalPerMonth || [];

    setSalesIndicators({ totalSales, totalPerDay, totalPerMonth });
    setLoadingSalesIndicators(false);
  }

  async function getUsers() {
    const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/all`;
    const response = await fetchApi(fetchUrl);
    if (!response.ok) return;

    const data = await response.json();
    const usersWithProps = data.map((user: { _id: any; props: { name: any; }; }) => ({
      id: user._id,
      name: user.props.name
    }));

    setUsers(usersWithProps);
    setLoadingUsers(false);
  }
  async function getAverageSales() {
    setLoadingAverages(true);
    const fetchUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/average-sales`);

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      fetchUrl.searchParams.append("endDate", endDate);
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      setLoadingAverages(false);
      return;
    }

    const averageData = await response.json();
    setAverageDailySales(averageData.averageDailySales || 0);
    setAverageMonthlySales(averageData.averageMonthlySales || 0);
    setLoadingAverages(false);
  }
  async function getExpenseIndicators() {
    setLoadingExpenseIndicators(true);
    const fetchUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/expenses/indicators`);

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      fetchUrl.searchParams.append("endDate", endDate);
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      setLoadingExpenseIndicators(false);
      return;
    }

    const data = await response.json();
    setExpenseIndicators(data);
    setLoadingExpenseIndicators(false);
  }
  async function getExpenseProportion() {
    setLoadingExpenseProportion(true);
    const fetchUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/expenses/proportion-by-category`);

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      fetchUrl.searchParams.append("endDate", endDate);
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      setLoadingExpenseProportion(false);
      return;
    }

    const proportionData = await response.json();
    console.log("Expense Proportion Data:", proportionData);
    setExpenseProportion(proportionData);
    setLoadingExpenseProportion(false);
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getSalesIndicators();
    getAverageSales();
    getExpenseIndicators();
    getExpenseProportion();
  }, [startDate, endDate, deliverymanId]);

  return (
    <main className="p-4">
      <Filters
        startDate={startDate}
        endDate={endDate}
        deliverymanId={deliverymanId}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setDeliverymanId={setDeliverymanId}
        getSalesIndicators={getSalesIndicators}
        loadingUsers={loadingUsers}
        users={users}
      />
      <SalesDashboard
        loadingSalesIndicators={loadingSalesIndicators}
        salesIndicators={salesIndicators}
        expenseIndicators={expenseIndicators}
        expenseProportion={expenseProportion}
        loadingExpenseIndicators={loadingExpenseIndicators}
        loadingExpenseProportion={loadingExpenseProportion}
        averageDailySales={averageDailySales}
        averageMonthlySales={averageMonthlySales}
      />
    </main>
  );
}
