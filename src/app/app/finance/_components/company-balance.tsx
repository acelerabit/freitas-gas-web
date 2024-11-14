"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchApi } from "@/services/fetchApi";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AccountBalance {
  bank: string;
  balance: number;
}

export function CompanyBalance() {
  const [balance, setBalance] = useState(0);
  const [accountsBalance, setAccountsBalance] = useState<AccountBalance[]>([]);

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

  async function getAccountsCompanyBalances() {
    const response = await fetchApi(`/transactions/balances`);

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

    setAccountsBalance(data);
  }

  useEffect(() => {
    getCompanyBalance();
    getAccountsCompanyBalances();
  }, []);

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {/* <Card className="w-96">
        <CardHeader>
          <CardTitle>Saldo em caixa</CardTitle>
        </CardHeader>

        <CardContent>
          <h1>{fCurrencyIntlBRL(balance / 100)}</h1>
        </CardContent>
      </Card> */}

      {accountsBalance.map((accountBalance, index) => {
        return (
          <Card key={index} className="w-60">
            <CardHeader>
              <CardTitle>{accountBalance.bank}</CardTitle>
            </CardHeader>

            <CardContent>
              <h1>{fCurrencyIntlBRL(accountBalance.balance / 100)}</h1>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
