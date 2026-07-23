export function formatDate(date: Date) {
  return new Date(date).toISOString().split("T")[0];
}
