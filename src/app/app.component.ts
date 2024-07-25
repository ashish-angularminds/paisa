import { Component, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { initalUserStateInterface } from './store/type/InitialUserState.interface';
import { userActions } from './store/action';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // constructor(private store: Store<{ user: initalUserStateInterface }>, private firestoreService: FirestoreService) { }
  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event: Event): void {
  //   // this.store.select('user').subscribe((data) => {
  //   //   localStorage.setItem('user', JSON.stringify(data));
  //   //   // this.firestoreService.updateDoc()
  //   // });
  //   localStorage.setItem('userState', "working");
  //   alert('test');
  // }
}
