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
  }).format(dateFormat);

  return `${dateDay} às ${dateTime}`;
}

export const handleDateAndTimeFormat = (selectedDate: Date, time: string) => {
  if (!selectedDate || !time) {
    return null;
  }

  const [hours, minutes] = time.split(':');

  
  const combinedDateTime = dayjs(selectedDate)
    .hour(Number(hours))
    .minute(Number(minutes));

  const isoFormat = combinedDateTime.toISOString();

  return isoFormat;
};

export const disablePastDates = (date: Date) => {
  const today = dayjs().startOf('day');
  return dayjs(date).isBefore(today);
};