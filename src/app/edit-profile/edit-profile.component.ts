import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  selectedFile: File | undefined;
  fileName = 'example.png';
  base64Image = '';

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  onBackClicked(){
    this._location.back()
  }

  onSaveChanges(){
    // this should be where the backend api to update user info must be called from
  }

  onFileSelected(event: Event): void {
    console.log(event);
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.selectedFile = files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
    //
    // this.backendService.uploadImage(this.base64Image).subscribe(
    //     (response) => {
    //       console.log('response received: ', response);
    //       this.uploadedImage = true;
    //     },
    //     (error) => {
    //       console.log('Error Uploading the Image');
    //     }
    // );
  }

  _handleReaderLoaded(readerEvt: ProgressEvent<FileReader>): void {
    const target = readerEvt.target;
    if (!target) {
      return;
    }
    const binaryString = target.result;
    if (typeof binaryString === 'string') {
      this.base64Image = btoa(binaryString);
    }
    console.log(this.base64Image);

      // Code to convert base64 string back to image:
      // var image = new Image();
      // image.src = 'data:image/png;base64,' + this.base64Image;
      // document.body.appendChild(image);
  }

}
