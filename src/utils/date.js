export function formatDateIST(value, { includeTime = true } = {}) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: includeTime ? '2-digit' : undefined,
    minute: includeTime ? '2-digit' : undefined,
    hour12: true,
  });

  const parts = dtf.formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const dd = parts.day;
  const mm = parts.month;
  const yyyy = parts.year;

  if (!includeTime) return `${dd}-${mm}-${yyyy}`;

  const hh = parts.hour?.padStart(2, '0');
  const min = parts.minute?.padStart(2, '0');
  const dayPeriod = parts.dayPeriod?.toUpperCase();

  return `${dd}-${mm}-${yyyy} ${hh}:${min} ${dayPeriod}`;
}

export function formatDateISTNoTime(value) {
  return formatDateIST(value, { includeTime: false });
}
