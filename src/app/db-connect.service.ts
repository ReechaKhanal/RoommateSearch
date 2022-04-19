import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbConnectService {
  signUpUrl = 'http://localhost:8080/sign_Up';
  getAllUserInfoUrl = 'http://localhost:8080/getAllUserInfo';
  loginUrl = 'http://localhost:8080/login';
  uploadImageUrl = 'http://localhost:8080/upload';
  getLoggedInUserUrl = 'http://localhost:8080/getLoggedInUser';
  getFilterDistanceUrl = 'http://localhost:8080/getFilterDistance';

  constructor(private http: HttpClient) { }

  sign_Up(data: any): Observable<object> {
    console.log('MAKING sign_up HTTP REQUEST');
    return this.http.post(this.signUpUrl, data);
  }

  login(data: any): Observable<object> {
    console.log('MAKING login HTTP REQUEST');
    return this.http.post(this.loginUrl, data, {withCredentials: true});
  }

  // HTTP request to ask the backend to send all the user information
  // get All User Info method makes a HTTP GET request right now
  getAllUserInfo(): Observable<object> {
    console.log('MAKING getAllUserInfo HTTP REQUEST');
    return this.http.get(this.getAllUserInfoUrl);
  }

  getLoggedInUser(): Observable<object> {
    console.log('MAKING getLoggedInUser HTTP REQUEST');
    return this.http.get(this.getLoggedInUserUrl, {withCredentials: true});
  }

  uploadImage(data: any): Observable<object> {
    console.log('Uploading Image to backend');
    return this.http.post(this.uploadImageUrl, data);
  }

  getFilterDistance(filter: any): Observable<object> {
    console.log('MAKING getFilterDistance HTTP REQUEST');
    let params = new HttpParams();
    params = params.append('longitude', filter.longitude);
    params = params.append('latitude', filter.latitude);
    params = params.append('distance', filter.distance);
    return this.http.get(this.getFilterDistanceUrl, {params});
  }
}
