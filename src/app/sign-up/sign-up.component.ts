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
  selectedFile: any;
  base64Image: String = "";
  uploadedImage: boolean = false; // Boolean value to check if the image was uploaded to the db
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
          this.signUpForm.get('login_var.email')?.setErrors({emailTaken: true});
        }
      );
    }
  }

  onFileSelected(event: any){
    console.log(event);
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }

    this.backendService.uploadImage(this.base64Image).subscribe(
      (response) => {
        console.log('response received: ', response);
        this.uploadedImage = true;
      },
      (error) => { console.log('Error Uploading the Image'); }
  );


  }

  _handleReaderLoaded(readerEvt: any) {
      var binaryString = readerEvt.target.result;
      this.base64Image= btoa(binaryString);
      console.log(this.base64Image);

      // Code to convert base64 string back to image:
      //var image = new Image();
      //image.src = 'data:image/png;base64,' + this.base64Image;
      //document.body.appendChild(image);
  }

}
