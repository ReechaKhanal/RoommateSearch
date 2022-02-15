import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  hide = true;
  constructor() {
    this.loginForm = new FormGroup({
      username: this.usernameFormControl,
      password: this.passwordFormControl
    });
  }

  ngOnInit(): void {
  }

  Submit(): void {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      // TODO: send form data to backend server
    }
  }

}
