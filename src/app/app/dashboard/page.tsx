"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import SalesDashboard from "../dashboard/_components/salesDashboard";

interface SalesIndicators {
  totalSales: number;
  totalPerDay: { createdAt: Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}

interface User {
  id: string;
  name: string;
}

export default function CardsStats() {
  const [salesIndicators, setSalesIndicators] = useState<SalesIndicators | null>(null);
  const [loadingSalesIndicators, setLoadingSalesIndicators] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deliverymanId, setDeliverymanId] = useState<string>("");

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
      setLoadingSalesIndicators(false);
      return;
    }

    const data = await response.json();
    setSalesIndicators(data);
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

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (startDate || endDate || deliverymanId) {
      getSalesIndicators();
    } else {
      getSalesIndicators();
    }
  }, [startDate, endDate, deliverymanId]);

  return (
    <main className="p-4">
      <SalesDashboard
        startDate={startDate}
        endDate={endDate}
        deliverymanId={deliverymanId}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setDeliverymanId={setDeliverymanId}
        loadingSalesIndicators={loadingSalesIndicators}
        salesIndicators={salesIndicators}
        loadingUsers={loadingUsers}
        users={users}
        getSalesIndicators={getSalesIndicators}
      />
    </main>
  );
}