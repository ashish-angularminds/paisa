import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirebaseError } from 'firebase/app';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from '../store/action';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  user: any;
  signupForm!: FormGroup<any>;
  constructor(private formBuilder: FormBuilder, private loadingCrtl: LoadingController, private authServices: AuthService, private toastController: ToastController, private router: Router, private store: Store) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      fullname: new FormControl(null, { validators: [Validators.required] }),
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

  async signup() {
    let loader = this.loadingCrtl.create();
    (await loader).present();
    if (this.signupForm.valid) {
      await this.authServices.registerUser(this.signupForm.controls['email'].value, this.signupForm.controls['password'].value).then(
        async (data) => {
          data.user?.updateProfile({ displayName: this.signupForm.controls['fullname'].value });
          this.user = data.user;
          this.store.dispatch(authActions.setToken({ token: this.user.multiFactor.user.accessToken }));
          console.log(this.user);
          (await loader).dismiss();
          this.presentToast('Registration successful');
          this.router.navigate(['/home']);
        }, async (error: FirebaseError) => {
          (await loader).dismiss();
          this.presentToast(error.message);
        });
    } else {
      this.presentToast('check email and password');
      (await loader).dismiss();
    }
  }

}
