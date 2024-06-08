// utils/dateUtils.js or helpers/dateTimeHelpers.js
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const formatDate = (dateString) => {
  const timeZone = 'UTC'; // Adjust the timeZone if necessary
  const date = utcToZonedTime(parseISO(dateString), timeZone);

  return format(date, 'dd MMM yyyy', { timeZone });
};

export const formatTimeSlot = ({ startDateTime, endDateTime }) => {
  const timeZone = 'UTC';
  const start = utcToZonedTime(parseISO(startDateTime), timeZone);
  const end = utcToZonedTime(parseISO(endDateTime), timeZone);

  return `${format(start, 'p', { timeZone })} - ${format(end, 'p', { timeZone })}`;
};
