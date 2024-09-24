import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockSales = [
  {
    id: '1',
    product: 'Café',
    quantity: 2,
    deliveryman: 'João',
    total: 10.0,
    date: new Date('2024-09-20'),
  },
  {
    id: '2',
    product: 'Pão',
    quantity: 5,
    deliveryman: 'Maria',
    total: 15.0,
    date: new Date('2024-09-21'),
  },
];

export default function SaleDetailsPage() {
  const router = useRouter();
  const { salesId } = router.query;
  const [sale, setSale] = useState<any>(null);

  useEffect(() => {
    if (salesId) {
      const foundSale = mockSales.find((s) => s.id === salesId);
      setSale(foundSale || null);
    }
  }, [salesId]);

  if (!sale) {
    return <p>Venda não encontrada.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Produto:</strong> {sale.product}</p>
        <p><strong>Quantidade:</strong> {sale.quantity}</p>
        <p><strong>Entregador:</strong> {sale.deliveryman}</p>
        <p><strong>Total:</strong> R$ {sale.total.toFixed(2)}</p>
        <p><strong>Data:</strong> {new Date(sale.date).toLocaleDateString()}</p>
        <Button onClick={() => router.push('/sales')}>Voltar</Button>
      </CardContent>
    </Card>
  );
}
