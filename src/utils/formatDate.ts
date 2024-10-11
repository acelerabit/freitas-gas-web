import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs?.extend(utc);

export function formatDate(date: string) {
  const dateFormat = new Date(date);

  return new Intl.DateTimeFormat('pt-br').format(dateFormat);
}

export function formatSignedDate(dateInput: Date | string): string {
  // Converte a data de entrada para um objeto dayjs
  const date = dayjs(dateInput);

  // Formata a data conforme necessário
  const formattedDate = `Assinado em ${date.format('D [de] MMMM, YYYY')}`;

  return formattedDate;
}


export function formatToUTC(date: Date) {
  return dayjs(date).utc().format('DD/MM/YYYY');
}

export function formatToUTCDate(date: Date) {
  return dayjs(date).utc().format('YYYY-MM-DD');
}

export function formatDateWithHours(date: string) {
  const dateFormat = new Date(date);

  const dateDay = new Intl.DateTimeFormat('pt-br').format(dateFormat);

  const dateTime = new Intl.DateTimeFormat('pt-br', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateFormat);

  return `${dateDay} ás ${dateTime}`;
}