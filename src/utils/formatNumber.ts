import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number: string | number) {
  return `R$ ${numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00')}`;
}

export function fCurrencyIntlBRL(number: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}