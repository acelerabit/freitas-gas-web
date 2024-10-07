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
import { toast } from "react-hot-toast";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "react-currency-mask";

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
  FULL: "COMPLETO",
  EMPTY: "VAZIO",
  COMODATO: "COMODATO",
};

export function SaleDialogForm({
  isOpen,
  onClose,
  onSubmit,
}: SaleDialogFormProps) {
  const { user } = useUser();
  const { control, handleSubmit, setValue } = useForm();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: "",
    deliverymanId: user?.id || "",
    products: [{ productId: "", type: "", status: "", price: 0, quantity: 1 }],
    paymentMethod: "",
  });

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

  const handleProductSelect = (productId: string, index: number) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        productId,
        type: selectedProduct.type,
        status: selectedProduct.status,
        price: selectedProduct.price,
        quantity: updatedProducts[index].quantity || 1,
      };

      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      setValue(`products[${index}]`, updatedProducts[index]);
    }
  };

  const addProductField = () => {
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        { productId: "", type: "", status: "", price: 0, quantity: 1 },
      ],
    }));
  };
  const onSubmitHandler = (data: any) => {
    const saleData = {
      ...formData,
      ...data,
      deliverymanId: user?.id || "",
    };
    onSubmit(saleData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Venda</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 w-full"
        >
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
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
            )}
          />
          {formData.products.map((product, index) => (
            <div key={index} className="space-y-4">
              <Controller
                name={`products[${index}].id`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => handleProductSelect(value, index)}
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
                  <div>
                    <Label>Status</Label>
                    <Input
                      placeholder="Status"
                      {...field}
                      value={
                        productTypes[
                          product.status as keyof typeof productTypes
                        ]
                      }
                      readOnly
                    />
                  </div>
                )}
              />
              <Controller
                name={`products[${index}].price`}
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Preço</Label>

                    <CurrencyInput
                      value={field.value}
                      onChangeValue={(_, value) => {
                        const updatedProducts = [...formData.products];
                        updatedProducts[index].price = parseFloat(String(value));
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
                    {/* <Input
                      placeholder="Preço"
                      type="number"
                      {...field}
                      value={product.price}
                      onChange={(e) => {
                        const updatedProducts = [...formData.products];
                        updatedProducts[index].price = parseFloat(
                          e.target.value
                        );
                        setFormData((prev) => ({
                          ...prev,
                          products: updatedProducts,
                        }));
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
                    <Input
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
                    />
                  </div>
                )}
              />
            </div>
          ))}

          <Button type="button" onClick={addProductField}>
            Adicionar Produto
          </Button>

          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  setFormData((prev) => ({ ...prev, paymentMethod: value }));
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
