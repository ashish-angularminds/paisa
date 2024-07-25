import { createFeature, createReducer, on } from "@ngrx/store";
import { initalUserStateInterface } from "./type/InitialUserState.interface";
import { userActions } from "./action";
import { accounts } from "./type/account.interface";
import { transaction, transactionType } from "./type/transaction.interface";

let lS: initalUserStateInterface = JSON.parse(localStorage.getItem('user') || "{}");

const initaluserstate: initalUserStateInterface = {
  accounts: lS.accounts || [],
  lastSMSUpdate: lS.lastSMSUpdate || undefined,
  Uid: lS.Uid || undefined
}

function addTransaction(_account: accounts, transaction: transaction): accounts {
  let account = { ..._account };
  if (transaction.type === transactionType.Credit) {
    account.totalCredit = account.totalCredit! + transaction.amount!;
  } else {
    account.totalSpent = account.totalSpent! + transaction.amount!;
  }
  return { ...account, transactions: [...account.transactions!, transaction] }
}

function updateTransaction(_account: accounts, transactionId: string, updatedtransaction: transaction): accounts {
  let account = { ..._account };
  account.transactions = account.transactions?.map((trans) => {
    if (trans.id === transactionId) {
      console.log('check:', trans, updatedtransaction);
      if (trans.type === updatedtransaction.type) {
        if (trans.type === transactionType.Credit) {
          account.totalCredit = (account.totalCredit! - trans.amount!) + updatedtransaction.amount!;
        } else {
          account.totalSpent = (account.totalSpent! - trans.amount!) + updatedtransaction.amount!;
        }
      } else {
        console.log('workingggg')
        if (trans.type === transactionType.Credit) {
          account.totalCredit = account.totalCredit! - trans.amount!;
          account.totalSpent = account.totalSpent! + (updatedtransaction.amount!) ? (updatedtransaction.amount!) : trans.amount!;
        } else {
          account.totalSpent = account.totalSpent! - trans.amount!;
          account.totalCredit = account.totalCredit! + (updatedtransaction.amount!) ? (updatedtransaction.amount!) : trans.amount!;
        }
      }
      console.log({ ...trans, ...updatedtransaction });
      return { ...trans, ...updatedtransaction }
    } else {
      return trans;
    }
  })
  return { ...account }
}

function deleteTransaction(_account: accounts, transactionId: string): accounts {
  let account = { ..._account };
  let newtransactions = account!.transactions!.filter((trans) => trans.id !== transactionId);
  let tmptransaction = account!.transactions!.find((data) => data.id === transactionId);
  if (tmptransaction!.type === transactionType.Credit) {
    account = { ...account, totalCredit: account.totalCredit! - tmptransaction!.amount! }
  } else {
    account = { ...account, totalSpent: account.totalSpent! - tmptransaction!.amount! }
  }
  return { ...account, transactions: newtransactions }
}

function curdTransaction(crud: any, accounts: accounts[], month: number, year: number, transactionId?: string, transaction?: transaction): accounts[] {
  return accounts.map((data: accounts) => {
    if (data.month === month && data.year === year) {
      if (crud === 'add') {
        return addTransaction(data, transaction!);
      } else if (crud === 'delete') {
        return data.transactions?.length! > 0 ? deleteTransaction(data, transactionId!) : data;
      } else {
        return updateTransaction(data, transactionId!, transaction!);
      }
    } else {
      return data;
    }
  });
}

const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initaluserstate,
    on(userActions.init, (state) => ({
      ...state,
    })),
    on(userActions.createUser, (state, action) => ({
      ...state,
      ...action.userData,
    })),
    on(userActions.deleteUser, (state) => ({
      ...state,
      accounts: [],
      lastSMSUpdate: undefined,
      Uid: undefined,
    })),
    on(userActions.updateUserLastSMSDate, (state, action) => ({
      ...state,
      lastSMSUpdate: action.date,
    })),
    on(userActions.createAccount, (state, action) => ({
      ...state,
      accounts: [...state.accounts, action.account],
    })),
    on(userActions.updateAccount, (state, action) => ({
      ...state,
      ...action.account,
    })),
    on(userActions.deleteAccount, (state, action) => ({
      ...state,
      accounts: state.accounts.filter((data) => data.month !== action.month && data.year !== action.year),
    })),
    on(userActions.addTransaction, (state, action) => ({
      ...state,
      accounts: curdTransaction('add', state.accounts, action.month, action.year, undefined, action.transaction),
    })),
    on(userActions.updateTransaction, (state, action) => ({
      ...state,
      accounts: curdTransaction('update', state.accounts, action.month, action.year, action.transactionId, action.newtransaction),
    })),
    on(userActions.deleteTransaction, (state, action) => ({
      ...state,
      accounts: curdTransaction('delete', state.accounts, action.month, action.year, action.transactionId),
    })),
  )
});

export const { name: userFeatureKey, reducer: userReducer, selectAccounts } = userFeature