import {Component, Input, OnInit, Output} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent implements OnInit {
  @Input() form!: FormGroup;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  constructor() {
  }

  ngOnInit(): void {
    this.form.addControl('email', this.emailFormControl);
  }

}
