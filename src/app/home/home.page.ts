import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { addDoc, collection, Firestore, updateDoc, doc } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { userActions } from '../store/action'
import { transaction, transactionCategory, transactionMode, transactionType } from '../store/type/transaction.interface';
import { Router } from '@angular/router';
import { initalUserStateInterface } from '../store/type/InitialUserState.interface';
import { ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { accounts } from '../store/type/account.interface';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonModal) modal: IonModal | any;
  user!: initalUserStateInterface;
  transactionId: string = '';
  isModalOpen = false;
  account!: accounts;
  newDate = new Date();
  transactionType = transactionType;
  transactionCategory = transactionCategory;
  transactionMode = transactionMode;
  transaction: transaction = {
    amount: undefined,
    category: undefined,
    createdAt: undefined,
    id: undefined,
    mode: undefined,
    type: undefined,
    updatedAt: undefined,
  };

  constructor(private toastController: ToastController, private store: Store<{ user: initalUserStateInterface }>, private firestore: Firestore, private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit() {
    // this.user = this.store.select('user');
    this.store.select('user').subscribe((data: initalUserStateInterface) => {
      this.user = data;
      [this.account] = data.accounts.filter((acc) => acc.month === this.newDate.getMonth() + 1 && acc.year === this.newDate.getFullYear());
    });
    // this.firestoreService.getDoc('IjeHy8DY1saRhEOmHqGt2pqKj0J2').then((data) => {
    // localStorage.setItem('user', JSON.stringify(data.data()));
    // console.log(data.data());
    // })
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  async addTransaction() {
    console.log(this.transaction);
    this.transaction.updatedAt = this.newDate;
    this.transaction.id = uuidv4();
    if (this.transaction!.amount! > 0 && this.transaction!.category !== undefined && this.transaction!.createdAt !== undefined && this.transaction!.updatedAt !== undefined && this.transaction!.id !== undefined && this.transaction!.mode !== undefined && this.transaction!.type !== undefined) {
      await this.store.dispatch(userActions.addTransaction({
        transaction:
        {
          amount: this.transaction.amount, type: this.transaction.type, id: this.transaction.id, mode: this.transaction.mode,
          category: this.transaction.category, createdAt: this.newDate, updatedAt: this.newDate
        },
        month: this.newDate.getMonth() + 1, year: this.newDate.getFullYear()
      }));
      this.store.select('user').subscribe(data => {
        this.firestoreService.updateDoc(this.user!.Uid!, data);
        localStorage.setItem('user', JSON.stringify(data));
      });

      this.setOpen(false);
    } else {
      this.presentToast('Transaction is not valid, check all fields')
    }

  }
  async deleteTransaction() {
    await this.store.dispatch(userActions.deleteTransaction({ transactionId: this.transactionId, month: 7, year: 2024 }));
  }

  async updateTransaction() {
    await this.store.dispatch(userActions.updateTransaction({ month: 7, newtransaction: { mode: transactionMode.UPI }, transactionId: 'test', year: 2024 }));
  }
}
