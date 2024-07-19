import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  user: any;
  signinForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private loadingCrtl: LoadingController, private authServices: AuthService) { }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, { validators: [Validators.required] })
    });
  }

  async signin() {
    let loader = this.loadingCrtl.create();
    (await loader).present();
    if (this.signinForm.valid) {
      (await loader).dismiss();
      this.user = await this.authServices.loginUser(this.signinForm.controls['email'].value, this.signinForm.controls['password'].value);
      console.log(this.user);
    } else {
      (await loader).dismiss();
      console.log('check email and password');
    }

  }

}
