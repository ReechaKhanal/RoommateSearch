import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DbConnectService } from '../db-connect.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  backendService: DbConnectService;
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
  constructor(backendService: DbConnectService) {
    this.backendService = backendService;
    this.signUpForm = new FormGroup({
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      telephone: this.telephoneFormControl,
      status: this.statusFormControl,
      gender: this.genderFormControl,
      address: this.addressFormControl,
      login_var: new FormGroup({
        email: this.emailFormControl,
        password: this.passwordFormControl
      })
    });
  }

  ngOnInit(): void {
  }
  sign_Up(): void {
    console.log(this.signUpForm.value);
    if (this.signUpForm.valid) {
      this.backendService.sign_Up(this.signUpForm.value).subscribe(
        (response) => {
          console.log('response received');
          },
        (error) => { console.log('error loading sign_Up data');
        }
      );
    }
  }

}
