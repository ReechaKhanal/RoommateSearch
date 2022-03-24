import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DbConnectService } from '../db-connect.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  backendService: DbConnectService;
  router: Router;
  emailFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  hide = true;
  constructor(backendService: DbConnectService, router: Router) {
    this.backendService = backendService;
    this.router = router;
    this.loginForm = new FormGroup({
      email: this.emailFormControl,
      password: this.passwordFormControl
    });
  }

  ngOnInit(): void {
  }

  Submit(): void {
    console.log(this.loginForm.valid);
    if (this.loginForm.valid) {
      const data: any = this.loginForm.value;
      this.backendService.login(data).subscribe(
          (response) => {
            this.router.navigate(['/home']);
          },
          (error) => {
            this.loginForm.reset();
          }
      );
    } else {
      this.loginForm.reset();
    }
  }

}
