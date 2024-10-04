import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

interface Customer {
  id: string;
  name: string;
}

type ProductType = "FULL" | "EMPTY" | "COMODATO";

const productTypes: Record<ProductType, string> = {
  FULL: "COMPLETO",
  EMPTY: "VAZIO",
  COMODATO: "COMODATO",
};

interface Product {
  id: string;
  type: ProductType;
  quantity: number;
  price: number;
  status: string;
}

interface SaleProduct {
  id: string;
  type: ProductType;
  quantity: number;
  price: number;
  status: string;
  productId: string;
  salePrice: number;
}

interface UpdateSaleDialogProps {
  open: boolean;
  onOpenChange: () => void;
  saleId: string;
}

// const formSchema = z.object({
//   customerId: z.string().min(1, {
//     message: "Cliente é obrigatório",
//   }),
//   // deliverymanId: z.string().min(1, {
//   //   message: "Entregador é obrigatório",
//   // }),
//   paymentMethod: z.string().min(1, {
//     message: "Forma de pagamento é obrigatória",
//   }),
// });

export function UpdateSaleDialog({
  open,
  onOpenChange,
  saleId,
}: UpdateSaleDialogProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);
  const { control, handleSubmit, setValue, watch, formState } = useForm();

  async function getSale() {
    const response = await fetchApi(`/sales/${saleId}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error || "Erro ao buscar clientes.");
      return;
    }

    const data = await response.json();

    setValue("customerId", data?.customer?.id);
    setValue("deliverymanId", data?.deliveryman?.id);
    setValue("paymentMethod", data.paymentMethod);

    setSaleProducts(data.products);
  }

  async function fetchCustomers() {
    const response = await fetchApi("/customers/all");

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error || "Erro ao buscar clientes.");
      return;
    }

    const data = await response.json();

    const formattedCustomers = data.map(
      (customer: { id: any; props: { id: any; name: any } }) => ({
        id: customer.props.id,
        name: customer.props.name,
      })
    );
    setCustomers(formattedCustomers);
  }

  async function fetchProducts() {
    const response = await fetchApi(`/products`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error || "Erro ao buscar produtos.");
      return;
    }

    const data = await response.json();

    const formattedProducts = data.map(
      (product: {
        _id: any;
        _props: { type: any; status: any; price: any; quantity: any };
      }) => ({
        id: product._id,
        type: product._props.type,
        status: product._props.status,
        price: product._props.price,
        quantity: product._props.quantity,
      })
    );
    setProducts(formattedProducts);
  }

  const onSubmit = async (values: any) => {
    const requestData = {
      customerId: values.customerId,
      // deliverymanId: values.deliverymanId,
      paymentMethod: values.paymentMethod,
      products: saleProducts
    };
    const response = await fetchApi(`/sales/${saleId}`, {
      method: "PUT",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error || "Erro ao atualizar a venda.");
      return;
    }

    toast.success("Venda editada com sucesso.");
    onOpenChange();
  };

  const handleProductSelect = (productId: string, index: number) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      const updatedProducts = [...saleProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        id: productId,
        type: selectedProduct.type,
        status: selectedProduct.status,
        price: selectedProduct.price,
        quantity: updatedProducts[index].quantity,
      };

      setSaleProducts(updatedProducts);

      setValue(`products[${index}].productId`, selectedProduct.id);
      setValue(`products[${index}].type`, selectedProduct.type);
      setValue(`products[${index}].status`, selectedProduct.status);
      setValue(`products[${index}].price`, selectedProduct.price);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  useEffect(() => {
    getSale();
  }, [saleId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          {" "}
          {/* Formulário responsivo */}
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {saleProducts &&
            saleProducts.length > 0 &&
            saleProducts.map((product, index) => (
              <>
                <div key={index} className="space-y-4">
                  <Controller
                    name={`products[${index}].id`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={product.productId}
                        onValueChange={(value) =>
                          handleProductSelect(value, index)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name={`products[${index}].status`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Status"
                        {...field}
                        value={
                          productTypes[
                            product.status as keyof typeof productTypes
                          ] || product.status
                        }
                        readOnly
                      />
                    )}
                  />

                  <Controller
                    name={`products[${index}].price`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Preço"
                        type="number"
                        {...field}
                        value={product.salePrice}
                        onChange={(e) => {
                          const updatedProducts = [...saleProducts];
                          updatedProducts[index].salePrice = parseFloat(
                            e.target.value
                          );
                          setSaleProducts(updatedProducts);
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`products[${index}].quantity`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Quantidade"
                        type="number"
                        {...field}
                        value={product.quantity}
                        onChange={(e) => {
                          const updatedProducts = [...saleProducts];
                          updatedProducts[index].quantity =
                            parseInt(e.target.value, 10) || 1;
                          setSaleProducts(updatedProducts);
                          field.onChange(parseInt(e.target.value, 10) || 1);
                        }}
                      />
                    )}
                  />
                </div>

                <Separator />
              </>

            ))}
          {/* <Button type="button" onClick={addProductField}>
            Adicionar Produto
          </Button> */}
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                  <SelectItem value="CARTAO">Cartão</SelectItem>
                  <SelectItem value="PIX">Pix</SelectItem>
                  <SelectItem value="FIADO">Fiado</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}