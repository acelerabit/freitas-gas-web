export const formatCurrency = (value: number): string => {
    const isValueInCents = value >= 1000;
    const divisor = isValueInCents ? 100 : 1;
    return (value / divisor).toFixed(2).replace(".", ",");
};
  