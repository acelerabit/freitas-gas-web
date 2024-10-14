"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchApi } from "@/services/fetchApi";
import CreateDebtDialog from "../_components/debts/create-debt-dialog";
import EditDebtDialog from "../_components/debts/edit-debt-dialog";
import DeleteDebtDialog from "../_components/debts/delete-debt-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const DebtsPage = () => {
  const { supplierId } = useParams();
  const [debts, setDebts] = useState<any[]>([]);
  const [loadingDebts, setLoadingDebts] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any>(null);

  const normalizedSupplierId = Array.isArray(supplierId) ? supplierId[0] : supplierId;

  async function getDebts() {
    setLoadingDebts(true);
    try {
      if (!normalizedSupplierId) return;

      const response = await fetchApi(`/suppliers/${normalizedSupplierId}/debts`);
      if (!response.ok) {
        throw new Error("Erro ao carregar débitos");
      }

      const data = await response.json();
      const debts = data.props.debts.map((debt: any) => ({
        id: debt.id,
        amount: debt.amount,
        dueDate: debt.dueDate,
        paid: debt.paid
      }));
  
      setDebts(debts);
    } catch (error) {
      console.error("Erro ao buscar débitos:", error);
    } finally {
      setLoadingDebts(false);
    }
  }

  useEffect(() => {
    if (normalizedSupplierId) {
      getDebts();
    }
  }, [normalizedSupplierId]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Débitos do Fornecedor</CardTitle>
        <Button onClick={() => setCreateDialogOpen(true)}>Cadastrar Débito</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto max-w-full">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingDebts ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : debts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Nenhum débito encontrado.</TableCell>
                </TableRow>
              ) : (
                debts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell>{debt.amount}</TableCell>
                    <TableCell>{new Date(debt.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Checkbox checked={debt.paid} disabled />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Button
                              onClick={() => {
                                setSelectedDebt(debt);
                                setEditDialogOpen(true);
                              }}
                            >
                              Editar
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              onClick={() => {
                                setSelectedDebt(debt);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Excluir
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CreateDebtDialog open={createDialogOpen} onOpenChange={() => setCreateDialogOpen(false)} supplierId={normalizedSupplierId} />
      <EditDebtDialog 
        open={editDialogOpen} 
        onOpenChange={() => setEditDialogOpen(false)} 
        debt={selectedDebt}
      />
      <DeleteDebtDialog 
        open={deleteDialogOpen} 
        onOpenChange={() => setDeleteDialogOpen(false)} 
        debtId={selectedDebt?.id} 
      />
    </Card>
  );
};

export default DebtsPage;
