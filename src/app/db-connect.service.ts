import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbConnectService {
  sign_Up() {
    console.log('MAKING sign_up HTTP REQUEST');
    return this.http.post(this.sign_UpUrl,null);
    //to add jason file as parameter
  }
  sign_UpUrl = 'http://localhost:8080/sign_Up';
  getAllUserInfoUrl = 'http://localhost:8080/getAllUserInfo';

  constructor(private http:HttpClient) { }

  // HTTP request to ask the backend to send all the user information
  // get All User Info method makes a HTTP GET request right now
  getAllUserInfo(){
    console.log('MAKING getAllUserInfo HTTP REQUEST');
    return this.http.get(this.getAllUserInfoUrl);
  }
}
