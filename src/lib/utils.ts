export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

// Get today's date in Chile timezone (YYYY-MM-DD)
export function getTodayChile(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Santiago'
  });
  // en-CA locale returns YYYY-MM-DD format
}

// Get a date string in Chile timezone from a UTC timestamp
export function toChileDate(utcString: string): string {
  return new Date(utcString).toLocaleDateString('en-CA', {
    timeZone: 'America/Santiago'
  });
}

// Get Chile-formatted time from UTC timestamp
export function toChileTime(utcString: string): string {
  return new Date(utcString).toLocaleTimeString('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get N days ago in Chile timezone
export function getDaysAgoChile(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}
