import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UpdateQuantityInputProps {
  field: any;
  index: number;
  product: any;
  saleProducts: any;
  setSaleProducts: any;
}

const UpdateQuantityInput = ({
  field,
  index,
  product,
  saleProducts,
  setSaleProducts,
}: UpdateQuantityInputProps) => {
  const handleQuantityChange = (newQuantity: number) => {
    const updatedProducts = [...saleProducts];
    updatedProducts[index].quantity = newQuantity >= 0 ? newQuantity : 0; // Garante que a quantidade não seja menor que 0
    setSaleProducts(updatedProducts);
    field.onChange(newQuantity >= 0 ? newQuantity : 0); // Garante consistência com React Hook Form
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {/* Botão Decrementar */}
      <Button
        type="button"
        onClick={() => handleQuantityChange(product.quantity - 1)}
        disabled={product.quantity <= 0} // Desabilita o botão se quantidade for 0
      >
        -
      </Button>

      {/* Input Numérico */}
      <Input
        placeholder="Quantidade"
        type="number"
        {...field}
        value={product.quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value, 10);
          handleQuantityChange(isNaN(newQuantity) ? 0 : newQuantity);
        }}
        className="text-center"
        min={0} // Evita entrada de valores negativos
      />

      {/* Botão Incrementar */}
      <Button
        type="button"
        onClick={() => handleQuantityChange(product.quantity + 1)}
      >
        +
      </Button>
    </div>
  );
};

export default UpdateQuantityInput;
