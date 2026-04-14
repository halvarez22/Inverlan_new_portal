/** Formato de miles para precios en formulario de alta de propiedad. */
export const formatNumber = (value: string): string => {
  const cleanValue = value.replace(/[^0-9.]/g, '');
  if (!cleanValue) return '';
  const parts = cleanValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  }
  return formattedInteger;
};

export const parseFormattedNumber = (formattedValue: string): number => {
  const cleanValue = formattedValue.replace(/,/g, '');
  return parseFloat(cleanValue) || 0;
};
