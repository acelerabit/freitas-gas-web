import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface BankAccount {
  id: string;
  bank: string;
  paymentsAssociated: string[];
}

export function ListBankAccounts() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'sjkasaks',
      bank: 'BB',
      paymentsAssociated: ['PIX', 'CREDIT_CARD']
    }
  ]);

  return (
    <>
      {bankAccounts.map((bankAccount) => (
        <Card key={bankAccount.id}>
          <CardHeader>
            <CardTitle>{bankAccount.bank}</CardTitle>
          </CardHeader>

          <CardContent>
            {bankAccount.paymentsAssociated.map((payment, index) => (
              <p key={index}>{payment}</p>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
