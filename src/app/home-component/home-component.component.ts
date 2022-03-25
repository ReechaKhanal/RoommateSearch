import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DbConnectService } from '../db-connect.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  backendService: DbConnectService;
  selectedFile: any;

  base64Image: String = ""

  //Loaded Data
  allUserInfo: any;

  // Data Load Check Boolean
  loadedAllUserInfo: boolean = false;

  uploadedImage: boolean = false;

  constructor(backendService: DbConnectService, private router: Router){
    this.backendService = backendService;
  }

  wantToChat(userId: string){
    console.log('I want to chat with the user:' + userId);
    this.router.navigate(['./chat']);
  }

  getAllUserInfo(){
    this.backendService.getAllUserInfo().subscribe(
      (response) => {
        console.log('response received');
        this.loadedAllUserInfo = true;
        this.allUserInfo = response;
        console.log(this.loadedAllUserInfo);
        console.log(this.allUserInfo);
        },
      (error) => { console.log('error loading getAllUserInfo data');
      }
    );
  }

  ngOnInit(): void {
    this.getAllUserInfo()
  }

  onFileSelected(event: any){
    console.log(event);
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      var reader = new FileReader();

      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }

  _handleReaderLoaded(readerEvt: any) {
      var binaryString = readerEvt.target.result;
      this.base64Image= btoa(binaryString);
      console.log(this.base64Image);

      var image = new Image();
      image.src = 'data:image/png;base64,' + this.base64Image;
      document.body.appendChild(image);
  }

  onUpload(){
    const fd = new FormData();
    this.backendService.uploadImage(this.base64Image).subscribe(
        (response) => {
          console.log('response received: ', response);
          this.uploadedImage = true;
        },
        (error) => { console.log('Error Uploading the Image'); }
    );
  }
}
