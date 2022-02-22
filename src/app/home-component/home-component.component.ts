import { Component, OnInit } from '@angular/core';
import { DbConnectService } from '../db-connect.service';

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

  constructor(backendService: DbConnectService){
    this.backendService = backendService;
  }

  wantToChat(userId: string){
    console.log('I want to chat with the user:' + userId);
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
      (error) => { console.log('error loading getAllUserInfo data'); }
    );
  }

  ngOnInit(): void {
    this.getAllUserInfo()
  }
}
