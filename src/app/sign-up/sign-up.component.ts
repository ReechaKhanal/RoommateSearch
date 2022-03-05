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
  sign_Up(): void {
    console.log(this.signUpForm.value);
    if (this.signUpForm.valid) {
      this.backendService.sign_Up().subscribe(
        (response) => {
          console.log('response received');
         
          },
        (error) => { console.log('error loading sign_Up data'); 
        }
      );
      // TODO: send form data to backend server, make a jason file wil all the incoming data
    }
  }

}
