"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";
import { useUser } from "../../../../contexts/user-context";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "react-currency-mask";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import ProductQuantityInput from "./input-quantity";

interface ProductType {
  id: string;
  type: string;
  quantity: number;
  price: number;
  status: string;
}

interface Customer {
  name: string;
  id: string;
}

interface SaleDialogFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const productTypes = {
  FULL: "CHEIO",
  EMPTY: "VAZIO",
  COMODATO: "COMODATO",
};

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

type BottleStatus = "EMPTY" | "FULL" | "COMODATO";

const bottleStatusMapper = [
  { key: "EMPTY", value: "Troca de gás" },
  { key: "FULL", value: "Vasilhame + gás" },
  { key: "COMODATO", value: "comodato" },
];

interface User {
  id: string;
  email: string;
  name: string;
}

export function SaleDialogForm({
  isOpen,
  onClose,
  onSubmit,
}: SaleDialogFormProps) {
  const { user } = useUser();
  const { control, handleSubmit, setValue, formState } = useForm();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: "",
    deliverymanId: user?.id || "",
    products: [{ type: "", status: "EMPTY", price: 0, quantity: 1 }],
    paymentMethod: "",
  });
  const [deliverymanSelected, setDeliverymanSelected] = useState("");
  const [deliverymanOptions, setDeliverymanOptions] = useState<User[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetchApi("/customers/all");
        const customersData = await customersResponse.json();
        const formattedCustomers = customersData.map(
          (customer: { id: any; props: { id: any; name: any } }) => ({
            id: customer.props.id,
            name: customer.props.name,
          })
        );
        setCustomers(formattedCustomers);

        const productsResponse = await fetchApi("/products");
        const productsData = await productsResponse.json();
        const formattedProducts = productsData.map(
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProductSelect = (type: string, index: number) => {
    let currentProduct = formData.products[index];

    const selectedProduct = products.find(
      (product) =>
        product.type === type && product.status === currentProduct.status
    );

    if (selectedProduct) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        type: type,
        status: currentProduct.status,
        price: selectedProduct.price,
        quantity: updatedProducts[index].quantity || 1,
      };

      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      setValue(`products[${index}]`, updatedProducts[index]);
    }
  };

  function handleTypeSaleSelect(value: string, index: number) {
    const selectedProduct = formData.products[index];

    const findProduct = products.find(
      (product) =>
        product.type === selectedProduct.type && product.status === value
    );

    if (selectedProduct && findProduct) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        type: selectedProduct.type,
        status: value,
        price: findProduct.price,
        quantity: updatedProducts[index].quantity || 1,
      };

      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      setValue(`products[${index}]`, updatedProducts[index]);
    }
  }

  const addProductField = () => {
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        { type: "", status: "EMPTY", price: 0, quantity: 1 },
      ],
    }));
  };
  const onSubmitHandler = () => {
    if (!formData.paymentMethod) {
      toast.error("Método de pagamento deve estar preenchido");
      return;
    }

    if (formData.products.length <= 0) {
      toast.error("Produtos são necessários para consolidar a venda.");

      return;
    }

    if (
      formData.products.some(
        (product: any) => product.type == null || product.type === ""
      )
    ) {
      toast.error("O tipo do produto deve ser selecionado", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    if (formData.products.some((product: any) => !product.status)) {
      toast.error("O tipo de venda deve ser selecionado");
      return;
    }

    if (
      formData.products.some(
        (product: any) => product.price == null || product.price < 0
      )
    ) {
      toast.error("O preço deve ser um valor válido.");
      return;
    }

    if (
      formData.products.some(
        (product: any) => product.quantity == null || product.quantity < 0
      )
    ) {
      toast.error("A quantidade deve ser um valor válido.");
      return;
    }

    if (user?.role === "ADMIN" && !deliverymanSelected) {
      toast.error("O entregador deve ser selecionado.");
      return;
    }

    const saleData = {
      ...formData,
      // ...data,
      deliverymanId: deliverymanSelected ? deliverymanSelected : user?.id,
    };

    onSubmit(saleData);
  };

  function removeProduct(index: number) {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  }

  function increment() {
    setCount((oldCount) => oldCount + 1);
  }

  function decrement() {
    if (count - 1 > 0) {
      setCount((oldCount) => oldCount - 1);
    }
  }

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
    if (isOpen) {
      getUsers();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Venda</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 w-full"
          noValidate
        >
          <Controller
            name="customerId"
            control={control}
            rules={{ required: "Selecione um cliente" }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, customerId: value }));
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
                {fieldState?.error && (
                  <p
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {fieldState?.error?.message}
                  </p>
                )}
              </>
            )}
          />
          {formData.products.map((product, index) => (
            <div key={index} className="space-y-4">
              <div className="flex gap-2  items-start">
                <div className="flex-1 space-y-4">
                  <Controller
                    name={`products[${index}].id`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            console.log("Selected Product:", value);
                            handleProductSelect(value, index);
                            field.onChange(value);
                          }}
                          value={field.value || ""}
                        >
                          <SelectTrigger
                            className={
                              fieldState?.error ? "border-red-500" : ""
                            }
                          >
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
                        {fieldState?.error && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {fieldState?.error?.message}
                          </p>
                        )}
                      </>
                    )}
                  />

                  <Controller
                    name={`products[${index}].status`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          {...field}
                          defaultValue="EMPTY"
                          onValueChange={(value) =>
                            handleTypeSaleSelect(value, index)
                          }
                        >
                          <SelectTrigger
                            className={
                              fieldState?.error ? "border-red-500" : ""
                            }
                          >
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
                        {fieldState?.error && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {fieldState?.error?.message}
                          </p>
                        )}
                      </>
                    )}
                  />

                  <Controller
                    name={`products[${index}].price`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <div>
                          <Label>Preço</Label>

                          <CurrencyInput
                            value={field.value}
                            onChangeValue={(_, value) => {
                              const updatedProducts = [...formData.products];
                              updatedProducts[index].price = parseFloat(
                                String(value)
                              );
                              setFormData((prev) => ({
                                ...prev,
                                products: updatedProducts,
                              }));
                              field.onChange(value);
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
                          {fieldState?.error && (
                            <p
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginTop: "4px",
                              }}
                            >
                              {fieldState?.error?.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  />

                  <Controller
                    name={`products[${index}].quantity`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <div>
                          <Label>Quantidade</Label>
                          {/* <Input
                            placeholder="Quantidade"
                            type="number"
                            {...field}
                            value={product.quantity}
                            onChange={(e) => {
                              const updatedProducts = [...formData.products];
                              updatedProducts[index].quantity =
                                parseInt(e.target.value, 10) || 1;
                              setFormData((prev) => ({
                                ...prev,
                                products: updatedProducts,
                              }));
                              field.onChange(parseInt(e.target.value, 10) || 1);
                            }}

                          /> */}
                          <ProductQuantityInput field={field} formData={formData} setFormData={setFormData} index={index} product={product} />
                          {fieldState?.error && (
                            <p
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginTop: "4px",
                              }}
                            >
                              {fieldState?.error?.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  />
                </div>

                <Button variant="ghost" onClick={() => removeProduct(index)}>
                  <Trash />
                </Button>
              </div>
              <Separator className="last:hidden" />
            </div>
          ))}
          <Button type="button" onClick={addProductField}>
            Adicionar Produto
          </Button>

          <Controller
            name="paymentMethod"
            control={control}
            rules={{ required: "Selecione um método de pagamento" }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData((prev) => ({ ...prev, paymentMethod: value }));
                  }}
                >
                  <SelectTrigger
                    className={fieldState?.error ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecione um método de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="CARTAO">Cartão de débito</SelectItem>
                    <SelectItem value="CARTAO_CREDITO">
                      Cartão de crédito
                    </SelectItem>
                    <SelectItem value="PIX">Pix</SelectItem>
                    <SelectItem value="FIADO">Venda a receber</SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState?.error && (
                  <p
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {fieldState?.error?.message}
                  </p>
                )}
              </>
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
