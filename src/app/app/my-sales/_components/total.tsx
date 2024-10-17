import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Total() {
  return (
    <div className="flex items-center gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Saldo do entregador</CardTitle>
          <CardDescription>Saldo na conta do entregador</CardDescription>

        </CardHeader>

        <CardContent>
          <h1>180</h1>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de receitas</CardTitle>
          <CardDescription>Receitas recebidas no dia de hoje</CardDescription>

        </CardHeader>

        <CardContent>
          <h1>100</h1>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de despesas do dia</CardTitle>
          <CardDescription>Despesas ocorridas no dia de hoje</CardDescription>

        </CardHeader>

        <CardContent>
          <h1>120</h1>
        </CardContent>
      </Card>
    </div>
  );
}
