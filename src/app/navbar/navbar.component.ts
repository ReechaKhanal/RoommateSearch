import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { DbConnectService } from '../db-connect.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  backendService: DbConnectService;

  //Loaded Data
  loggedInUserInfo: any;

  // Data load check Boolean
  userLoggedIn = false;


  constructor(private sideNavService: SidebarService, backendService: DbConnectService) {
    this.backendService = backendService;
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
  }

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  onProfileClick(){
    if (this.userLoggedIn == true){
      this.sideNavService.toggle();
    }else{
      console.log('User Must be logged in to access profile features');
    }
  }

}
