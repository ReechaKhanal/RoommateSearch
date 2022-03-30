import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../navbar/sidebar.service';
import { DbConnectService } from '../db-connect.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  backendService: DbConnectService;

  //Loaded Data
  loggedInUserInfo: any;

  // Data Load Check Boolean
  userLoggedIn = false;
  loadedLoggedInUser = false;

  constructor(private sideNavService: SidebarService, backendService: DbConnectService) {
    this.backendService = backendService;
  }

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  onUpdatePreferencesClick(){
    this.sideNavService.toggle()
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
}
