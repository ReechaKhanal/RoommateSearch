import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  telephoneFormControl = new FormControl('', [Validators.pattern('[- +()0-9]+')]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  statusFormControl = new FormControl('', [Validators.required]);
  genderFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
  hide = true;
  constructor() {
    this.signUpForm = new FormGroup({
      email: this.emailFormControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      telephone: this.telephoneFormControl,
      password: this.passwordFormControl,
      status: this.statusFormControl,
      gender: this.genderFormControl,
      address: this.addressFormControl
    });
  }

  ngOnInit(): void {
  }
  signUp(): void {
    console.log(this.signUpForm.value);
    if (this.signUpForm.valid) {
      // TODO: send form data to backend server
    }
  }

}
