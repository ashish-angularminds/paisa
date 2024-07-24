import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { initalUserStateInterface } from "./type/InitialUserState.interface";
import { accounts } from "./type/account.interface";
import { transaction } from "./type/transaction.interface";

// export const accountActions = createActionGroup({
//   source: "account",
//   events: {
//     addTransaction: props<{ transaction: transaction, month: number, year: number }>(),
//     updateTransaction: props<{ transaction: transaction, month: number, year: number }>(),
//     deleteTransaction: props<{ transactionId: string, month: number, year: number }>(),
//   }
// })

export const userActions = createActionGroup({
  source: "user",
  events: {
    init: emptyProps(),
    createUser: props<{ userData: initalUserStateInterface }>(),
    deleteUser: emptyProps(),
    updateUserLastSMSDate: props<{ date: Date }>(),
    createAccount: props<{ account: accounts }>(),
    deleteAccount: props<{ month: number, year: number }>(),
    updateAccount: props<{ account: accounts }>(),
    addTransaction: props<{ transaction: transaction, month: number, year: number }>(),
    updateTransaction: props<{ transactionId: string, newtransaction: transaction, month: number, year: number }>(),
    deleteTransaction: props<{ transactionId: string, month: number, year: number }>(),
  }
})