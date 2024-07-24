import { transaction } from "./transaction.interface";

export interface accounts {
  transactions?: transaction[],
  totalSpent?: number,
  totalCredit?: number,
  savings?: number,
  month?: number,
  year?: number
} 