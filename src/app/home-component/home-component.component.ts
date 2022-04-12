import { Component, OnInit } from '@angular/core';
import { DbConnectService } from '../db-connect.service';
import { Router } from '@angular/router';

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

  constructor(backendService: DbConnectService, private router: Router){
    this.backendService = backendService;
  }

  wantToChat(user: any): void{
    if(this.userLoggedIn == true){
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
}
