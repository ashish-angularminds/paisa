import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SmsTransactionListComponent } from './sms-transaction-list/sms-transaction-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, UserMenuComponent, SmsTransactionListComponent]
})
export class HomePageModule { }
