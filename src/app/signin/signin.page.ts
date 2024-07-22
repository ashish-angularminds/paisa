import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { FirebaseError } from 'firebase/app';
import { ActivatedRoute, Router, RouterEvent, RouterLink, RouterModule } from '@angular/router';
import { authActions } from '../store/action';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  user: any;
  signinForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private loadingCrtl: LoadingController, private authServices: AuthService, private store: Store, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, { validators: [Validators.required] })
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

  async signin() {
    let loader = this.loadingCrtl.create();
    (await loader).present();
    if (this.signinForm.valid) {
      await this.authServices.loginUserWithEamil(this.signinForm.controls['email'].value, this.signinForm.controls['password'].value).then(
        async (data) => {
          this.user = data.user;
          this.store.dispatch(authActions.setToken({ token: this.user.multiFactor.user.accessToken }));
          this.presentToast('Login Successful');
          console.log(this.user);
          (await loader).dismiss();
          this.router.navigate(['/home']);
        },
        async (error: FirebaseError) => {
          this.presentToast(error.message);
          (await loader).dismiss();
        }
      );
    } else {
      (await loader).dismiss();
      this.presentToast('check email and password');
    }
  }
}
