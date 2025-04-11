import dayjs from 'dayjs';

export const formatDateTime = (date: Date) => dayjs(date).format('HH:mm - DD/MM/YYYY');
