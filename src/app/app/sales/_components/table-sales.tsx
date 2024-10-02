"use client";

import { useForm, Controller } from 'react-hook-form';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import { fetchApi } from "@/services/fetchApi";
import { useUser } from "../../../../contexts/user-context";
import { Toaster, toast } from 'react-hot-toast';
import TableSale from './table-sale';

type ProductType = 'FULL' | 'EMPTY' | 'COMODATO';
interface Product {
  id: string;
  type: ProductType;
  quantity: number;
  price: number;
  status: string;
}
const productTypes: Record<ProductType, string> = {
  FULL: "COMPLETO",
  EMPTY: "VAZIO",
  COMODATO: "COMODATO"
};

interface Sale {
  id: string;
  products: Product[];
  deliveryman: string;
  paymentMethod: string;
  customer: string;
  saleType: string;
  total: number;
  date: Date;
}
interface Customer {
  name: string;
  id: string;
  props: {
    id: string;
    name: string;
  };
}

const mockSales: Sale[] = [
  {
    id: '1',
    products: [
      { id: 'P3', type: 'COMODATO', quantity: 2, price: 5.0, status: 'COMODATO' },
      { id: 'P45', type: 'FULL', quantity: 1, price: 10.0, status: 'FULL' },
    ],
    deliveryman: 'João',
    paymentMethod: 'Cartão',
    customer: 'Cliente A',
    saleType: 'Conteúdo',
    total: 20.0,
    date: new Date('2024-09-20'),
  },
  {
    id: '2',
    products: [
      { id: 'P20', type: 'COMODATO', quantity: 5, price: 3.0, status: 'COMODATO' },
    ],
    deliveryman: 'Maria',
    paymentMethod: 'Dinheiro',
    customer: 'Cliente B',
    saleType: 'Vasilhame Cheio',
    total: 15.0,
    date: new Date('2024-09-21'),
  },
  {
    id: '3',
    products: [
      { id: 'P13', type: 'FULL', quantity: 3, price: 8.0, status: 'FULL' },
    ],
    deliveryman: 'Carlos',
    paymentMethod: 'Pix',
    customer: 'Cliente C',
    saleType: 'Vasilhame Vazio',
    total: 24.0,
    date: new Date('2024-09-22'),
  },
];

export function TableSales() {
  const { user } = useUser();
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loadingSales, setLoadingSales] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { control, handleSubmit, setValue, watch } = useForm();

  const [formData, setFormData] = useState({
    customerId: "",
    deliverymanId: user?.id || "",
    products: [{ productId: "", type: "", status: "", price: 0, quantity: 1 }],
    paymentMethod: "",
  });

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetchApi('/customers/all');
        const customersData = await customersResponse.json();
        const formattedCustomers = customersData.map((customer: { id: any; props: { id: any; name: any; }; }) => ({
          id: customer.props.id,
          name: customer.props.name,
        }));
        setCustomers(formattedCustomers);
  
        const productsResponse = await fetchApi('/products');
        const productsData = await productsResponse.json();
        const formattedProducts = productsData.map((product: { _id: any; _props: { type: any; status: any; price: any; quantity: any; }; }) => ({
          id: product._id,
          type: product._props.type,
          status: product._props.status,
          price: product._props.price,
          quantity: product._props.quantity
        }));               
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleProductSelect = (productId: string, index: number) => {
    const selectedProduct = products.find(product => product.id === productId);
    if (selectedProduct) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId,
        type: selectedProduct.type,
        status: selectedProduct.status,
        price: selectedProduct.price,
        quantity: updatedProducts[index].quantity,
      };

      setFormData(prev => ({ ...prev, products: updatedProducts }));

      setValue(`products[${index}].type`, selectedProduct.type);
      setValue(`products[${index}].status`, selectedProduct.status);
      setValue(`products[${index}].price`, selectedProduct.price);
    }
  };

  const addProductField = () => {
    setFormData(prevData => ({
      ...prevData,
      products: [...prevData.products, { productId: "", type: "", status: "", price: 0, quantity: 1 }],
    }));
  };  

  const onSubmit = async () => {
    try {
      const response = await fetchApi("/sales", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Erro ao cadastrar a venda. Cliente genérico não pode pegar em comodato!');
      }
  
      toast.success("Venda cadastrada com sucesso.");
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar a venda.");
    }
  };

  useEffect(() => {
    setLoadingSales(true);
    const paginatedSales = mockSales.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    setSales(paginatedSales);
    setLoadingSales(false);
  }, [page]);

  return (
    <>
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
          <div className="flex justify-end mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <Button onClick={handleOpenDialog} className="w-full sm:w-auto">Cadastrar Venda</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Nova Venda</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full"> {/* Formulário responsivo */}
                  <Controller
                    name="customerId"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        {...field}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, customerId: value }));
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
                    <div key={index}>
                      <Controller
                        name={`products[${index}].productId`}
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
                              {products.map(product => (
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
                            value={productTypes[product.status as keyof typeof productTypes] || product.status}
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
                            value={product.price}
                            onChange={(e) => {
                              const updatedProducts = [...formData.products];
                              updatedProducts[index].price = parseFloat(e.target.value);
                              setFormData(prev => ({ ...prev, products: updatedProducts }));
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
                              const updatedProducts = [...formData.products];
                              updatedProducts[index].quantity = parseInt(e.target.value, 10) || 1;
                              setFormData(prev => ({ ...prev, products: updatedProducts }));
                              field.onChange(parseInt(e.target.value, 10) || 1);
                            }}
                          />
                        )}
                      />
                    </div>
                  ))}
  
                  <Button type="button" onClick={addProductField}>Adicionar Produto</Button>
  
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setFormData(prev => ({ ...prev, paymentMethod: value }));
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
                    <Button type="submit" className="w-full sm:w-auto">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <TableSale />
        </CardContent>
      </Card>
    </>
  );  
}
