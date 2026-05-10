import { format } from 'date-fns';

export function formatProjectDate(startDate?: Date | string, endDate?: Date | string, isOngoing?: boolean) {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const startStr = format(start, 'MMM yyyy');
  
  if (isOngoing) {
    return `${startStr} - Present`;
  }
  
  if (endDate) {
    const end = new Date(endDate);
    const endStr = format(end, 'MMM yyyy');
    return `${startStr} - ${endStr}`;
  }
  
  return startStr;
}
