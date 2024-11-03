import { format } from "date-fns";

export function formatMonth(date: Date): string {
  return format(date, "yyyy-MM")
}
/**
 * 数値にコンマを入れるためのフォーマット
 * @param amount
 * @returns
 */
export function formantCurrency(amount: number): string {
  return amount.toLocaleString("ja-JP")
}