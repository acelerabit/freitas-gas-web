import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface BankAccount {
  id: string;
  bank: string;
  paymentsAssociated: string[];
}

enum PaymentMethod {
  
}

const paymentInterface = {
  PIX: 'Pix',
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO: 'Cartão de débito',
  DINHEIRO: 'Dinheiro',
  FIADO: 'À receber',
  TRANSFERENCIA: 'Transferência'
}

export function ListBankAccounts() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "sjkasaks",
      bank: "BB",
      paymentsAssociated: ["PIX", "CARTAO_CREDITO"],
    },
    {
      id: "sjkasasdds",
      bank: "Bradesco",
      paymentsAssociated: ["PIX", "DINHEIRO"],
    },
  ]);

  return (
    <div className="space-y-4">
      {bankAccounts.map((bankAccount) => (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>{bankAccount.bank}</CardTitle>

            <Button variant="ghost">
              <Pencil className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent>
            {bankAccount.paymentsAssociated.map((payment) => (
              <p>{paymentInterface[payment as keyof typeof paymentInterface]}</p>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
