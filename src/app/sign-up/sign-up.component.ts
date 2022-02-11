import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  constructor() {
    this.signUpForm = new FormGroup({
      a: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  signUp(): void {
    console.log(this.signUpForm.value);
  }

}
