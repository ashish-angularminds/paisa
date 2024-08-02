import { Component, OnInit } from '@angular/core';
import { ToggleChangeEventDetail, ToggleCustomEvent } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { SMSInboxReader, SMSFilter, SMSObject } from 'capacitor-sms-inbox/dist/esm'
import { userActions } from 'src/app/store/action';
import { initalUserStateInterface } from 'src/app/store/type/InitialUserState.interface';
import { transactionInterface, transactionMode, transactionType } from 'src/app/store/type/transaction.interface';

@Component({
  selector: 'app-sms-transaction-list',
  templateUrl: './sms-transaction-list.component.html',
  styleUrls: ['./sms-transaction-list.component.scss'],
})
export class SmsTransactionListComponent implements OnInit {

  constructor(private store: Store<{ user: initalUserStateInterface }>) { }

  permissionFlag: boolean = true;
  smsList: [] = [];
  transactionQueue: any = [];
  // filter?: SMSFilter;
  sampleDate = new Date("08/01/2024").valueOf();
  filter: SMSFilter = { minDate: this.sampleDate };

  async ngOnInit(): Promise<void> {
    // this.store.select('user').subscribe((data) => {
    //   this.filter = { minDate: (new Date(data.lastSMSUpdate.seconds).valueOf()) }
    // })
    SMSInboxReader.checkPermissions().then(async (data: any) => {
      if (data.sms !== "granted") {
        this.requestPermission();
      } else {
        this.permissionFlag = true;
        this.loadData();
      }
    })
  }

  requestPermission() {
    SMSInboxReader.requestPermissions().then(() => {
      SMSInboxReader.checkPermissions().then(async (data: any) => {
        if (data.sms === "granted") {
          this.loadData();
          this.permissionFlag = true;
        }
      })
    });
  }

  loadData() {
    SMSInboxReader.getSMSList({ filter: this.filter }).then((data: any[any]) => {
      this.smsList = data.smsList.filter((element: SMSObject) => /Rs/i.test(element.body));
    });

    let transactionRegex = /sent|spent|transfer|purchase|payment|hand-picked|paid|fueled|debited|credited/i;
    let spendRegex = /sent|spent|transfer|purchase|payment|hand-picked|paid|fueled|debited/i;
    let creditRegex = /credited/i;
    let amountRegex = /rs|inr|by/i;
    let accountRegex = /onecard|hdfc|sbi/i;
    let modeRegex = /upi|credit|withdrawn/i;
    let merchantRegex = /to|at/i;
    // let categoryRegex = /purchase|hand-picked|fueled|/i;
    // let createdAtRegex = /rs/i;
    // let updatedAtRegex = /rs/i;
    // SMSInboxReader.getSMSList({ filter: this.filter }).then((data: any[any]) => {
    //   this.smsList = data.smsList.filter((element: SMSObject) => (/Rs|debited/i.test(element.body) && /^((?!otp).)*$/gmi.test(element.body) && /^((?!statement).)*$/gmi.test(element.body)));
    //   this.smsList.forEach((element: SMSObject) => {
    //     let newtransaction: transactionInterface = {
    //       id: '',
    //       merchant: '',
    //       createdAt: { seconds: element.date },
    //       updatedAt: { seconds: element.date },
    //     };
    //     if (spendRegex.test(element.body)) {
    //       let splitString = element.body.split(' ');
    //       splitString.forEach((str, index) => {
    //         if (amountRegex.test(str)) {
    //           newtransaction.amount = newtransaction.account ? newtransaction.amount : (str.match(/\d/g)?.join('') ? Number(str.match(/\d/g)?.join('')) : Number(splitString[index + 1]));
    //         }
    //         if (spendRegex.test(str)) {
    //           newtransaction.type = transactionType.Debit;
    //         }
    //         else if (creditRegex.test(str)) {
    //           newtransaction.type = transactionType.Credit;
    //         }
    //         if (accountRegex.test(str)) {
    //           newtransaction.account = str.match(accountRegex)![0];
    //         }
    //         if (modeRegex.test(str)) {
    //           newtransaction.mode = str.match(modeRegex)![0] !== 'upi' ? str.match(modeRegex)![0] === 'withdraw' ? transactionMode.Debit_Card : transactionMode.Credit_Card : transactionMode.UPI;
    //         }
    //         if (merchantRegex.test(str)) {
    //           let i = index + 1;
    //           while (splitString[i] !== 'on') {
    //             newtransaction.merchant = newtransaction.merchant + ' ' + splitString[i];
    //             i = i + 1;
    //           }
    //         }
    //       });
    //       this.transactionQueue.push(newtransaction);
    //     }
    //   });
    //   // this.creditSmsList = this.smsList.filter((element: SMSObject) => creditRegex.test(element.body));
    // });
  }

  toggleStateChange(event: ToggleCustomEvent) {
    if (event.detail.value === "credit") {
      this.store.dispatch(userActions.updateUser({ user: { creditSMSFlag: event.detail.checked } }));
    } else {
      this.store.dispatch(userActions.updateUser({ user: { debitSMSFlag: event.detail.checked } }));
    }
  }


}
