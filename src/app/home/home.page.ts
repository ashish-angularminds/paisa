import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { addDoc, collection, Firestore, updateDoc, doc } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { userActions } from '../store/action'
import { transactionInterface, transactionCategory, transactionMode, transactionType } from '../store/type/transaction.interface';
import { Router } from '@angular/router';
import { initalUserStateInterface } from '../store/type/InitialUserState.interface';
import { ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { accounts } from '../store/type/account.interface';
import { v4 as uuidv4 } from 'uuid';
import { selectAccounts, selectLastSMSUpdate, selectUid } from '../store/selectors'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {

  @ViewChild(IonModal) modal: IonModal | any;
  user!: initalUserStateInterface;
  transactionId: string = '';
  isModalOpen = false;
  account!: accounts;
  newDate = new Date();
  newDateEpoch = Date.now() / 1000;
  transactionType = transactionType;
  transactionCategory = transactionCategory;
  transactionMode = transactionMode;
  transaction: transactionInterface = {
    amount: undefined,
    category: undefined,
    createdAt: undefined,
    id: undefined,
    mode: undefined,
    type: undefined,
    updatedAt: undefined,
  };

  constructor(private toastController: ToastController, private store: Store<{ user: initalUserStateInterface }>, private firestore: Firestore, private firestoreService: FirestoreService, private router: Router) { }

  async ngOnInit() {
    this.initializeData();
  }

  dateConverter(date: any) {
    return (new Date(date.seconds * 1000).toLocaleDateString()) + " - " + (new Date(date.seconds * 1000).toLocaleTimeString('en-US'));
  }

  getTransactionCategory(data: any) {
    switch (data) {
      case 0:
        return "Food";
      case 1:
        return "Shopping";
      case 2:
        return "Travel";
      case 3:
        return "Medical";
      case 4:
        return "Other";
      default:
        return "";
    }
  }

  getTransactionType(data: any) {
    switch (data) {
      case 0:
        return "Credit";
      case 1:
        return "Debit";
      default:
        return "";
    }
  }

  getTransactionMode(data: any) {
    switch (data) {
      case 0:
        return "Cash";
      case 1:
        return "UPI";
      case 2:
        return "Card";
      default:
        return "";
    }
  }

  reverseList(list: transactionInterface[]) {
    let tmpList = [...list];
    return tmpList.sort((a: any, b: any) => {
      const aDate: any = new Date(b?.createdAt?.seconds * 1000);
      const bDate: any = new Date(a?.createdAt?.seconds * 1000);
      return aDate - bDate;
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  formCreatedAt!: any;
  setOpen(isOpen: boolean, trans?: transactionInterface) {
    if (trans) {
      this.transaction = trans;
      this.formCreatedAt = new Date(trans.createdAt?.seconds! * 1000).toISOString();
      console.log(this.formCreatedAt.toString());
      this.isModalOpen = isOpen;
    } else {
      this.isModalOpen = isOpen;
    }
  }

  calculateQuota(amount: number) {
    let date = new Date("07/25/2024");
    let totalDays = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0).getDate();
    let remainingDays = date.getDate();
    let quota = Math.trunc(amount / (totalDays - remainingDays));
    let totalquota = Math.trunc(amount / totalDays);
    return quota + "/" + totalquota;
  }

  updateFirestoreDoc() {
    this.store.select('user').subscribe(async (data) => {
      await this.firestoreService.updateDoc(data!.Uid!, data);
      localStorage.setItem('user', JSON.stringify(data));
    });
  }

  getAccount() {
    this.store.select('user').subscribe((data: initalUserStateInterface) => {
      this.user = data;
      [this.account] = data.accounts.filter((acc) => acc.month === this.newDate.getMonth() + 1 && acc.year === this.newDate.getFullYear());
    });
  }

  getFirestoreDoc() {
    this.store.select(selectUid).subscribe(async (data) => {
      await this.firestoreService.getDoc(data!).then((data) => {
        localStorage.setItem('user', JSON.stringify(data.data()));
      })
    });
  }

  foodAmount: number = 0;
  shoppingAmount: number = 0;
  medicalAmount: number = 0;
  travelAmount: number = 0;
  otherAmount: number = 0;
  initializeData() {
    this.updateFirestoreDoc();
    this.getFirestoreDoc();
    this.getAccount();

    this.account.transactions?.map((data) => {
      if (data.type === transactionType.Debit) {
        switch (data.category) {
          case 0:
            this.foodAmount = this.foodAmount + data.amount!;
            break;
          case 1:
            this.shoppingAmount = this.shoppingAmount + data.amount!;
            break;
          case 2:
            this.travelAmount = this.travelAmount + data.amount!;
            break;
          case 3:
            this.medicalAmount = this.medicalAmount + data.amount!;
            break;
          case 4:
            this.otherAmount = this.otherAmount + data.amount!;
            break;
          default:
            break;
        }
      }
      return data;
    });
  }

  async addTransaction() {
    if (this.transaction.id) {
      console.log("check");

      this.updateTransaction()
    } else {
      this.transaction.createdAt = { seconds: Date.parse(this.formCreatedAt) / 1000 };
      this.transaction.updatedAt = { seconds: this.newDateEpoch };
      this.transaction.id = uuidv4();
      console.log(this.transaction);

      if (this.transaction!.amount! > 0 && this.transaction!.category !== undefined && this.transaction!.createdAt !== undefined && this.transaction!.updatedAt !== undefined && this.transaction!.id !== undefined && this.transaction!.mode !== undefined && this.transaction!.type !== undefined) {
        await this.store.dispatch(userActions.addTransaction({
          transaction:
          {
            amount: this.transaction.amount, type: this.transaction.type, id: this.transaction.id, mode: this.transaction.mode,
            category: this.transaction.category, createdAt: this.transaction.createdAt, updatedAt: this.transaction.updatedAt
          },
          month: new Date(this.formCreatedAt).getMonth() + 1, year: new Date(this.formCreatedAt).getFullYear()
        }));
        this.store.select('user').subscribe(data => {
          this.firestoreService.updateDoc(this.user!.Uid!, data);
          localStorage.setItem('user', JSON.stringify(data));
        });
        this.initializeData();
        this.setOpen(false);
      } else {
        this.presentToast('Transaction is not valid, check all fields')
      }
    }
  }
  async deleteTransaction(id: string, seconds: number) {
    let date = new Date(seconds * 1000);
    await this.store.dispatch(userActions.deleteTransaction({ transactionId: id, month: date.getMonth() + 1, year: date.getFullYear() }));
    this.initializeData();
  }

  async updateTransaction() {
    let tmpDate = new Date(this.transaction.createdAt?.seconds! * 1000);
    let updated: transactionInterface = {
      id: this.transaction.id,
      amount: this.transaction.amount,
      category: this.transaction.category,
      mode: this.transaction.mode,
      type: this.transaction.type,
      createdAt: { seconds: Date.parse(this.formCreatedAt) / 1000 },
      updatedAt: { seconds: this.newDateEpoch }
    };
    console.log(updated);
    await this.store.dispatch(userActions.updateTransaction({ month: tmpDate.getMonth() + 1, newtransaction: updated, transactionId: this.transaction.id!, year: tmpDate.getFullYear() }));
    this.initializeData();
    this.setOpen(false);
  }
}
