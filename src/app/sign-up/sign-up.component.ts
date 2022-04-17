import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DbConnectService} from '../db-connect.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  backendService: DbConnectService;
  signUpForm: FormGroup;
  selectedFile: File | undefined;
  fileName = 'example.png';
  base64Image = '';
  router: Router;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  telephoneFormControl = new FormControl('', [Validators.pattern('[- +()0-9]+')]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  statusFormControl = new FormControl('', [Validators.required]);
  genderFormControl = new FormControl('', [Validators.required]);
  hide = true;
  constructor(backendService: DbConnectService, router: Router) {
    this.backendService = backendService;
    this.router = router;
    this.signUpForm = new FormGroup({
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      phNumber: this.telephoneFormControl,
      hasPlace: this.statusFormControl,
      gender: this.genderFormControl,
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
      data.image = this.base64Image;
      // Check if user selected an option
      if (data.address !== String) {
        data.place = {};
        data.place.name = data.address.label;
        data.place.latitude = data.address.x;
        data.place.longitude = data.address.y;
      }
      this.backendService.sign_Up(data).subscribe(
        (response) => {
          this.router.navigate(['/home']);
          },
        (error) => {
          this.signUpForm.get('login_var.email')?.setErrors({emailTaken: true});
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    console.log(event);
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.selectedFile = files[0];
    if (this.selectedFile !== undefined) {
      this.fileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }

  _handleReaderLoaded(readerEvt: ProgressEvent<FileReader>): void {
    const target = readerEvt.target;
    if (!target) {
      return;
    }
    const binaryString = target.result;
    if (typeof binaryString === 'string') {
      this.base64Image = 'data:' + this.selectedFile?.type + ';base64,' + btoa(binaryString);
    }
    console.log(this.base64Image);

      // Code to convert base64 string back to image:
      // var image = new Image();
      // image.src = 'data:image/png;base64,' + this.base64Image;
      // document.body.appendChild(image);
  }

}
