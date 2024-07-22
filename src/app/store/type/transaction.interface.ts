
enum transactionType {
  Credit,
  Debit
}
enum transactionMode {
  Cash,
  UPI,
  Card
}
enum transactionCategory {
  Food,
  Shopping,
  Travel,
  Medical,
  Other
}
export interface transaction {
  id: string,
  amount: number,
  type: transactionType,
  mode: transactionMode,
  category: transactionCategory,
  createdAt: Date,
  updatedAt: Date
}