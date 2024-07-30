import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { initalUserStateInterface } from 'src/app/store/type/InitialUserState.interface';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {

  constructor(private store: Store<{ user: initalUserStateInterface }>, private authService: AuthService) { }

  user: any;

  async ngOnInit() {
    this.user = this.authService.getProfileWithId(localStorage.getItem('token') || '');
  }

}
