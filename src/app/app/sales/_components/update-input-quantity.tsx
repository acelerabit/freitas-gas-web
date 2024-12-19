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
    updatedProducts[index].quantity = newQuantity >= 0 ? newQuantity : 0;
    field.onChange(newQuantity >= 0 ? newQuantity : 0);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {/* Botão Decrementar */}
      <Button
        type="button"
        onClick={() => handleQuantityChange(product.quantity - 1)}
        disabled={product.quantity <= 0}
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
        min={0}
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
