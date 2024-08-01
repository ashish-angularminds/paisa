import { Component, OnInit } from '@angular/core';
import { ToggleChangeEventDetail, ToggleCustomEvent } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { SMSInboxReader, SMSFilter, SMSObject } from 'capacitor-sms-inbox/dist/esm'
import { userActions } from 'src/app/store/action';
import { initalUserStateInterface } from 'src/app/store/type/InitialUserState.interface';

@Component({
  selector: 'app-sms-transaction-list',
  templateUrl: './sms-transaction-list.component.html',
  styleUrls: ['./sms-transaction-list.component.scss'],
})
export class SmsTransactionListComponent implements OnInit {

  constructor(private store: Store<{ user: initalUserStateInterface }>) { }

  permissionFlag: boolean = true;
  public smsList: any = [];
  public spentSmsList: any = [];
  public creditSmsList: any = [];
  filter?: SMSFilter;

  async ngOnInit(): Promise<void> {
    this.store.select('user').subscribe((data) => {
      this.filter = { minDate: new Date(data.lastSMSUpdate.seconds).valueOf() }
    })
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
    let spendRegex = /sent|spent|transfer|purchase|payment|hand-picked|paid|fueled/i;
    let creditRegex = /credited/i;
    SMSInboxReader.getSMSList({ filter: this.filter }).then((data: any[any]) => {
      this.smsList = data.smsList.filter((element: SMSObject) => /Rs/i.test(element.body));
      this.spentSmsList = this.smsList.filter((element: SMSObject) => spendRegex.test(element.body));
      this.creditSmsList = this.smsList.filter((element: SMSObject) => creditRegex.test(element.body));
    });
  }

  toggleStateChange(event: ToggleCustomEvent) {
    if (event.detail.value === "credit") {
      this.store.dispatch(userActions.updateUser({ user: { creditSMSFlag: event.detail.checked } }));
    } else {
      this.store.dispatch(userActions.updateUser({ user: { debitSMSFlag: event.detail.checked } }));
    }
  }


}
