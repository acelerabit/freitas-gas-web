"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchApi } from "@/services/fetchApi";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CompanyBalance() {
  const [balance, setBalance] = useState(0);

  async function getCompanyBalance() {
    const response = await fetchApi(`/transactions/balance`);

    if (!response.ok) {
      const respError = await response.json();

      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const data = await response.json();

    setBalance(data);
  }

  useEffect(() => {
    getCompanyBalance()
  }, [])

  return (
    <div className="mb-4">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Saldo da empresa</CardTitle>
        </CardHeader>

        <CardContent>
          <h1>{fCurrencyIntlBRL(balance / 100)}</h1>
        </CardContent>
      </Card>
    </div>
  );
}
