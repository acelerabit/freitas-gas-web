import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

interface ProductQuantityInputProps {
  field: any;
  index: number;
  product: any;
  formData: any;
  setFormData: any;
}
const ProductQuantityInput = ({
  field,
  index,
  product,
  formData,
  setFormData,
}: ProductQuantityInputProps) => {
  const handleQuantityChange = (newQuantity: number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index].quantity = newQuantity >= 0 ? newQuantity : 0; // Garante que a quantidade não seja menor que 0
    setFormData((prev: any) => ({
      ...prev,
      products: updatedProducts,
    }));
    field.onChange(newQuantity >= 0 ? newQuantity : 0); // Garante consistência
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
        min={0} // Garante que o valor não possa ser menor que zero
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

export default ProductQuantityInput;
