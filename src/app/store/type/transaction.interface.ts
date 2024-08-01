
export enum transactionType {
  Credit,
  Debit
}
export enum transactionMode {
  Cash,
  UPI,
  Card
}
export enum transactionCategory {
  Food,
  Shopping,
  Travel,
  Medical,
  Other
}


export interface transactionInterface {
  id?: string,
  amount?: number,
  account?: string,
  type?: transactionType,
  mode?: transactionMode,
  category?: transactionCategory,
  merchant?: string,
  createdAt?: { seconds: number },
  updatedAt?: { seconds: number },
}