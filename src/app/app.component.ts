import { Component } from '@angular/core';
import { DbConnectService } from './db-connect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RoommateSearch';

  backendService: DbConnectService;

  // Loaded Data
  allUserInfo: any;

  // Loaded Data Boolean
  loadedAllUserInfo: boolean = false;

  constructor(backendService: DbConnectService){
    this.backendService = backendService;
    this.getAllUserInfo();
  }

  getAllUserInfo(){
    this.backendService.getAllUserInfo().subscribe(
      (response) => {
        console.log('response received');
        this.loadedAllUserInfo = true;
        this.allUserInfo = response;
        },
      (error) => { console.log('error loading getAllUserInfo data'); }
    );
  }

}
