export function subtract(date: Date, day: number): Date {
  date.setDate(date.getDate() - day);
  return date;
}
