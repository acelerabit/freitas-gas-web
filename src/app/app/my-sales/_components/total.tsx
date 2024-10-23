"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import LoadingAnimation from "../../_components/loading-page";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";

export function Total() {
  const {user, loadingUser} = useUser()
  const [expensesToday, setExpensesToday] = useState(0)
  const [revenuesToday, setRevenuesToday] = useState(0)
  const [accountAmount, setAccountAmount] = useState(0)


  async function getAccountAmount() {

    const response = await fetchApi(
      `/transactions/deliveryman/balance/${user?.id}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setAccountAmount(data);
  }



  async function getExpensesToday() {

    const response = await fetchApi(
      `/transactions/expenses-total-today/${user?.id}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setExpensesToday(data);
  }

  async function getRevenuesToday() {

    const response = await fetchApi(
      `/sales/revenues-total-today/${user?.id}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setRevenuesToday(data);
  }

  useEffect(() => {
    getExpensesToday()
    getRevenuesToday()
    getAccountAmount()
  }, [])

  if(loadingUser) {
    return <LoadingAnimation />
  }
  return (
    <div className="flex items-center gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Saldo do entregador</CardTitle>
          <CardDescription>Saldo na conta do entregador</CardDescription>

        </CardHeader>

        <CardContent>
          <h1>{fCurrencyIntlBRL(accountAmount / 100)}</h1>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de receitas do dia</CardTitle>
          <CardDescription>Receitas recebidas no dia de hoje</CardDescription>

        </CardHeader>

        <CardContent>
        <h1>{fCurrencyIntlBRL(revenuesToday / 100)}</h1>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de despesas do dia</CardTitle>
          <CardDescription>Despesas ocorridas no dia de hoje</CardDescription>

        </CardHeader>

        <CardContent>
        <h1>{fCurrencyIntlBRL(expensesToday / 100)}</h1>
        </CardContent>
      </Card>
    </div>
  );
}