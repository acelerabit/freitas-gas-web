"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from "@/services/fetchApi";
import { useUser } from "@/contexts/user-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TotalSalesResponse {
  [key: string]: string;
}

const GetTotalSalesForToday: React.FC = () => {
  const { user } = useUser();
  const [salesData, setSalesData] = useState<TotalSalesResponse | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSalesData = async () => {
      try {
        const response = await fetchApi(`/sales/total-sales/today/${user.id}`);
        const data: TotalSalesResponse = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Erro ao carregar dados das vendas:', error);
      }
    };

    fetchSalesData();
  }, [user]);

  const getCardColor = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'CARTAO':
        return 'bg-blue-500';
      case 'DINHEIRO':
        return 'bg-yellow-500';
      case 'FIADO':
        return 'bg-red-500';
      case 'PIX':
        return 'bg-green-500';
      case 'CARTAO_CREDITO':
        return 'bg-indigo-500';
      case 'TRANSFERENCIA':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentMethodLabel = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'CARTAO':
        return 'Cartão';
      case 'DINHEIRO':
        return 'Dinheiro';
      case 'FIADO':
        return 'Vendas a receber';
      case 'PIX':
        return 'Pix';
      case 'CARTAO_CREDITO':
        return 'Cartão de crédito';
      case 'TRANSFERENCIA':
          return 'Transferência';
      default:
        return 'Outros';
    }
  };

  if (!salesData) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Total em vendas no dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(salesData).map(([paymentMethod, total]) => {
            const cardColor = getCardColor(paymentMethod);

            return (
              <div key={paymentMethod} className={`p-4 rounded-lg shadow-md ${cardColor} flex flex-col items-center w-1/2 sm:w-1/4 md:w-1/6`}>
                <h3 className="text-lg font-semibold text-white text-center">{getPaymentMethodLabel(paymentMethod)}</h3>
                <p className="text-xl font-bold text-white text-center">{`R$ ${parseFloat(total).toFixed(2)}`}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GetTotalSalesForToday;
