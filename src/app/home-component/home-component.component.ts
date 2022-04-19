import {Component, OnInit} from '@angular/core';
import {DbConnectService} from '../db-connect.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  backendService: DbConnectService;
  selectedFile: any;

  // Loaded Data
  allUserInfo: any;
  loggedInUserInfo: any;

  // Data Load Check Boolean
  loadedAllUserInfo = false;
  loadedLoggedInUser = false;
  uploadedImage = false;
  userLoggedIn = false;

  // Location Search
  locationSearchForm: FormGroup;
  distanceFormControl = new FormControl('25', [Validators.required]);

  constructor(backendService: DbConnectService, private router: Router){
    this.backendService = backendService;
    this.locationSearchForm = new FormGroup( {
        distance: this.distanceFormControl,
    });
  }

  wantToChat(user: any): void{
    if (this.userLoggedIn){
      console.log('I want to chat with the user:' + user.Name);
      this.router.navigate(['./chat'], {queryParams: {userId: user.Id, userName: user.Name}});
    }
    else{
      console.log('You should be logged in to chat');
    }
  }

  getAllUserInfo(): void{
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

  getLoggedInUser(): void {
    this.backendService.getLoggedInUser().subscribe(
        (response) => {
            this.userLoggedIn = true;
            this.loggedInUserInfo = response;
            console.log(this.loggedInUserInfo);
        },
        (error) => {
            console.log('error loading getLoggedInUser data');
            this.userLoggedIn = false;
        }
    );
    this.loadedLoggedInUser = true;
  }

  ngOnInit(): void {
    this.getAllUserInfo();
    this.getLoggedInUser();
  }

  searchLocation(): void {
      console.log(this.locationSearchForm.value);
      if (this.locationSearchForm.valid) {
          const data: any = this.locationSearchForm.value;
          const params: any = {};
          // Check if user selected an option
          if (data.address !== String) {
              params.latitude = data.address.y;
              params.longitude = data.address.x;
              params.distance = data.distance;
          }
          console.log(params);
          this.backendService.getFilterDistance(params).subscribe(
              (response) => {
                  console.log(response);
                  this.allUserInfo = response;
              },
              (error) => {
                  console.log('error loading getFilterDistance data');
              }
          );
      }
  }
}
