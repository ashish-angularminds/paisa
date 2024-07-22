import { Component, OnInit } from '@angular/core';
import { selectUserToken } from '../store/reducers'
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  token$: any;

  constructor(private store: Store) { }

  ngOnInit() {
    this.token$ = this.store.select(selectUserToken);
  }
}
