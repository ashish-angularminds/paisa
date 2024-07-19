import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  user: any;
  signupForm!: FormGroup<any>;
  constructor(private formBuilder: FormBuilder, private loadingCrtl: LoadingController, private authServices: AuthService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      fullname: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, { validators: [Validators.required] })
    });
  }

  async signup() {
    let loader = this.loadingCrtl.create();
    (await loader).present();
    if (this.signupForm.valid) {
      (await loader).dismiss();
      this.user = await this.authServices.registerUser(this.signupForm.controls['email'].value, this.signupForm.controls['password'].value);
      console.log(this.user);
    } else {
      (await loader).dismiss();
      console.log('check email and password');
    }
  }

}
