import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DbConnectService } from '../db-connect.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  backendService: DbConnectService;
  signUpForm: FormGroup;
  router: Router;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  telephoneFormControl = new FormControl('', [Validators.pattern('[- +()0-9]+')]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  statusFormControl = new FormControl('', [Validators.required]);
  genderFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
  hide = true;
  constructor(backendService: DbConnectService, router: Router) {
    this.backendService = backendService;
    this.router = router;
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
      const data: any = this.signUpForm.value;
      data.name = data.firstName + ' ' + data.lastName;
      this.backendService.sign_Up(data).subscribe(
        (response) => {
          this.router.navigate(['/home']);
          },
        (error) => {
          this.signUpForm.get('login_var.email')?.reset();
        }
      );
    }
  }

}
