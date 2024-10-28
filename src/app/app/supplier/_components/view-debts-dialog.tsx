import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/services/fetchApi";

interface ViewDebtsDialogProps {
  supplierId: string;
}

const ViewDebtsDialog: React.FC<ViewDebtsDialogProps> = ({ supplierId }) => {
  const [debts, setDebts] = useState<any[]>([]);
  const [loadingDebts, setLoadingDebts] = useState(true);

  async function getDebts() {
    setLoadingDebts(true);
    try {
      const response = await fetchApi(`/suppliers/${supplierId}/debts`);
      if (!response.ok) {
        throw new Error("Erro ao carregar débitos");
      }

      const data = await response.json();
      setDebts(data.props.debts);
    } catch (error) {
      console.error("Erro ao buscar débitos:", error);
    } finally {
      setLoadingDebts(false);
    }
  }

  useEffect(() => {
    getDebts();
  }, [supplierId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Ver Débitos</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Débitos do Fornecedor</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto max-w-full">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
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
                    <TableCell>{debt.description}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(Number(debt.amount) / 100)}
                    </TableCell>
                    <TableCell>{debt.date}</TableCell>
                    <TableCell>
                      {/* Botões para editar e excluir o débito */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDebtsDialog;
