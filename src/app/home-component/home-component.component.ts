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

  //Loaded Data
  allUserInfo: any;

  // Data Load Check Boolean
  loadedAllUserInfo: boolean = false;

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
}
