import Masker from 'vanilla-masker';

export const maskPhone = (value: string) =>
  value ? Masker.toPattern(value, '(99) 99999-9999') : '';

export const maskCpf = (value: string) =>
  value ? Masker.toPattern(value, '999.999.999-99') : '';

export const maskDateTime = (value: string) =>
  value ? Masker.toPattern(value, '99/99/9999 99:99') : '';

export const maskHour = (value: string) =>
  value ? Masker.toPattern(value, '99:99') : '';

export const unmaskField = (value: any) =>
  value ? value.replace(/\D/g, '') : '';

export const maskCnpj = (value: string) =>
  value ? Masker.toPattern(value, '99.999.999/9999-99') : '';

export const maskProfit = (value: string) =>
  value ? Masker.toPattern(value, 'R$9999999') : '';

export const formatNumber = (
  amount: number | string,
  decimalCount = 2,
  decimal = ',',
  thousands = '.'
) => {
  decimalCount = Math.abs(decimalCount);
  decimalCount = Number.isNaN(decimalCount) ? 2 : decimalCount;
  const NewAmount: number = Number(amount);
  const negativeSign = amount < 0 ? '-' : '';
  const i = parseInt(
    Math.abs(Number(NewAmount) || 0).toFixed(decimalCount),
    10
  ).toString();
  const j = i.length > 3 ? i.length % 3 : 0;

  return (
    negativeSign +
    (j ? i.substr(0, j) + thousands : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
    (decimalCount
      ? decimal +
        Math.abs(NewAmount - i)
          .toFixed(decimalCount)
          .slice(2)
      : '')
  );
};

export const toCurrencyLocale = (value: string, hideCurrency?: boolean) => {
  if (!value) return 'R$ 0,00';
  try {
    const formattedValue = value && parseFloat(value).toFixed(2);

    return `${hideCurrency ? '' : 'R$ '}${formatNumber(formattedValue)}`;
  } catch (err) {
    return 'R$ 0,00';
  }
};
