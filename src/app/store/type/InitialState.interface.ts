import { accounts } from "./account.interface";

export interface initalStateInterface {
  userToken: string | undefined,
  accounts: accounts[] | undefined,
  lastSMSUpdate: Date | undefined
}