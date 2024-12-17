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
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "react-currency-mask";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, formatISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/user-context";
import ProductQuantityInput from "./input-quantity";
import UpdateQuantityInput from "./update-input-quantity";

interface Customer {
  id: string;
  name: string;
}

type ProductType = "FULL" | "EMPTY" | "COMODATO";

const productTypes: Record<ProductType, string> = {
  FULL: "CHEIO",
  EMPTY: "VAZIO",
  COMODATO: "COMODATO",
};

type BottleStatus = "EMPTY" | "FULL" | "COMODATO";

const productTypesMapper = [
  {
    key: "P13",
    value: "P13",
  },
  {
    key: "P20",
    value: "P20",
  },
  {
    key: "P45",
    value: "P45",
  },
];

const bottleStatusMapper = [
  { key: "EMPTY", value: "Troca de gás" },
  { key: "FULL", value: "Vasilhame + gás" },
  { key: "COMODATO", value: "comodato" },
];

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
  typeSale: string;
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

interface User {
  id: string;
  email: string;
  name: string;
}

export function UpdateSaleDialog({
  open,
  onOpenChange,
  saleId,
}: UpdateSaleDialogProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [deliverymanSelected, setDeliverymanSelected] = useState("");
  const [deliverymanOptions, setDeliverymanOptions] = useState<User[]>([]);

  const { control, handleSubmit, setValue } = useForm();

  const { user, loadingUser } = useUser();

  async function getSale() {
    const response = await fetchApi(`/sales/${saleId}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error || "Erro ao buscar clientes.");
      return;
    }

    const data = await response.json();

    setSelectedDate(data.createdAt ? new Date(data.createdAt) : undefined);

    setValue("customerId", data?.customer?.id);
    setValue("deliverymanId", data?.deliveryman?.id);
    setValue("paymentMethod", data.paymentMethod);

    setDeliverymanSelected(data?.deliveryman?.id);

    if (data.products) {
      const saleProductsUpdated = data?.products.map((product: any) => {
        return {
          ...product,
          price: product.price / 100,
          salePrice: product.salePrice / 100,
        };
      });

      setSaleProducts(saleProductsUpdated);
    }
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
        price: product._props.price / 100,
        quantity: product._props.quantity,
      })
    );
    setProducts(formattedProducts);
  }

  const onSubmit = async (values: any) => {
    if (!selectedDate) {
      toast.error("Alguma data deve ser selecionada");
      return;
    }

    const formattedDate = formatISO(selectedDate);

    const requestData = {
      customerId: values.customerId,
      deliverymanId: deliverymanSelected ?? null,
      paymentMethod: values.paymentMethod,
      products: saleProducts,
      createdAt: formattedDate,
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
    window.location.reload();
  };

  const handleProductSelect = (type: ProductType, index: number) => {
    const selectedProduct = products[index];

    if (selectedProduct) {
      const updatedProducts = [...saleProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        id: selectedProduct.id,
        type: type,
        status: selectedProduct.status,
        typeSale: selectedProduct.status,
        price: selectedProduct.price,
        quantity: updatedProducts[index].quantity,
      };

      setSaleProducts(updatedProducts);

      setValue(`products[${index}].productId`, selectedProduct.id);
      setValue(`products[${index}].type`, type);
      setValue(`products[${index}].status`, selectedProduct.status);
      setValue(`products[${index}].price`, selectedProduct.price);
    }
  };

  function handleTypeSaleSelect(status: string, index: number) {
    const selectedProduct = products[index];

    if (selectedProduct) {
      const updatedProducts = [...saleProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        id: selectedProduct.id,
        type: selectedProduct.type,
        status,
        price: selectedProduct.price,
        quantity: updatedProducts[index].quantity,
      };

      setSaleProducts(updatedProducts);

      setValue(`products[${index}].productId`, selectedProduct.id);
      setValue(`products[${index}].type`, selectedProduct.type);
      setValue(`products[${index}].status`, status);
      setValue(`products[${index}].price`, selectedProduct.price);
    }
  }

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (open) {
      getSale();
    }
  }, [saleId, open, deliverymanOptions]);

  async function getUsers() {
    const response = await fetchApi(`/users/all`);

    if (!response.ok) {
      const respError = await response.json();
      return;
    }

    const data = await response.json();

    const usersFormatted = data.map((user: any) => ({
      id: user._id,
      name: user.props.name,
      email: user.props.email,
    }));

    setDeliverymanOptions(usersFormatted);
  }

  useEffect(() => {
    if (open) {
      getUsers();
    }
  }, [open]);

  if (loadingUser) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
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
                        defaultValue={product.type}
                        onValueChange={(value) =>
                          handleProductSelect(value as ProductType, index)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypesMapper.map((product) => (
                            <SelectItem key={product.key} value={product.key}>
                              {product.value}
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
                      <Select
                        {...field}
                        defaultValue={product.typeSale}
                        onValueChange={(value) =>
                          handleTypeSaleSelect(value, index)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo de venda" />
                        </SelectTrigger>
                        <SelectContent>
                          {bottleStatusMapper.map((bottle) => (
                            <SelectItem key={bottle.key} value={bottle.key}>
                              {bottle.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    name={`products[${index}].price`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Preço</Label>

                        <CurrencyInput
                          {...field}
                          value={product.salePrice}
                          onChangeValue={(_, value) => {
                            const updatedProducts = [...saleProducts];
                            updatedProducts[index].salePrice = parseFloat(
                              String(value)
                            );
                            setSaleProducts(updatedProducts);
                            field.onChange(parseFloat(String(value)));
                          }}
                          InputElement={
                            <input
                              type="text"
                              id="currency"
                              placeholder="R$ 0,00"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          }
                        />

                        {/* <Input
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
                        /> */}
                      </div>
                    )}
                  />
                  <Controller
                    name={`products[${index}].quantity`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Quantidade</Label>
                        {/* <Input
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
                        /> */}
                        <UpdateQuantityInput field={field} saleProducts={saleProducts} setSaleProducts={setSaleProducts} index={index} product={product} />
                      </div>
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
                  <SelectItem value="CARTAO_CREDITO">
                    Cartão de crédito
                  </SelectItem>
                  <SelectItem value="PIX">Pix</SelectItem>
                  <SelectItem value="FIADO">Venda a receber</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {user?.role === "ADMIN" && (
            <Select
              value={deliverymanSelected}
              onValueChange={(value) => {
                setDeliverymanSelected(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um entregador" />
              </SelectTrigger>
              <SelectContent>
                {deliverymanOptions.map((deliveryman) => {
                  return (
                    <SelectItem key={deliveryman.id} value={deliveryman.id}>
                      {deliveryman.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`text-left font-normal ${
                    !selectedDate ? "text-muted-foreground" : ""
                  }`}
                >
                  {selectedDate ? (
                    format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
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
