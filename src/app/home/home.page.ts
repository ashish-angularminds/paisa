import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addDoc, collection, Firestore, updateDoc, doc } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { userActions } from '../store/action'
import { transactionCategory, transactionMode, transactionType } from '../store/type/transaction.interface';
import { Router } from '@angular/router';
import { initalUserStateInterface } from '../store/type/InitialUserState.interface';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: any;
  transactionId: string = '';

  constructor(private store: Store<{ user: initalUserStateInterface }>, private firestore: Firestore, private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit() {
    console.log('ttestt');
    this.user = this.store.select('user');
  }

  async add() {
    await this.store.dispatch(userActions.addTransaction({ transaction: { amount: 10, type: transactionType.Credit, id: 'test', mode: transactionMode.Card }, month: new Date().getMonth() + 1, year: new Date().getFullYear() }));
    this.transactionId = 'test';
    // this.store.dispatch(userActions.createUser({ userData: { accounts: [], lastSMSUpdate: new Date(), Uid: 'test' } }));
    // this.store.dispatch(userActions.createAccount({ account: { month: 7, year: 2024, totalCredit: 0, savings: 0, totalSpent: 0, transactions: [] } }));
    // this.store.dispatch(userActions.createAccount({ account: { month: 6, year: 2024, totalCredit: 0, savings: 0, totalSpent: 0, transactions: [] } }));
    // this.store.dispatch(userActions.addTransaction({
    //   month: 7, year: 2024, transaction:
    //     { amount: 10, category: transactionCategory.Food, id: '1', mode: transactionMode.Card, type: transactionType.Credit, createdAt: new Date(), updatedAt: new Date() }
    // }));
    // this.store.dispatch(userActions.deleteUser());
    // this.router.navigate(['/landing']);
  }
  async delete() {
    await this.store.dispatch(userActions.deleteTransaction({ transactionId: this.transactionId, month: 7, year: 2024 }));
  }

  async update() {
    await this.store.dispatch(userActions.updateTransaction({ month: 7, newtransaction: { mode: transactionMode.UPI }, transactionId: 'test', year: 2024 }));
  }
}
