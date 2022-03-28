import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  onBackClicked(){
    this._location.back()
  }

  onSaveChanges(){
    // this should be where the backend api to update user info must be called from
  }

}
