import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { loginReq } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  constructor(private http: HttpClient, ) {
    if(typeof window !== 'undefined'){
    const token = sessionStorage.getItem('userToken');
    if (token && !this.isTokenExpired()) {
      this.token.next(token);
      this.loggedIn.next(true);
    } else {
      this.logout(); // Clears token and expiry from session storage if expired
    }
  }
  }
  setUserLoggedIn(token: string, expiresIn: number): void {
    if(typeof window !== 'undefined'){
    const expiryTime = new Date().getTime() + expiresIn * 1000; // Assuming expiresIn is in seconds
    sessionStorage.setItem('userToken', token);
    sessionStorage.setItem('tokenExpiry', expiryTime.toString());
    this.token.next(token);
    this.loggedIn.next(true);
    }
  }
  
  public loggedIn = new BehaviorSubject<boolean>(false);
  private token = new BehaviorSubject<string>('');

  isLoggedIn = this.loggedIn.asObservable();
  public logged : boolean = false;

  //private loginUrl = 'https://mock.apidog.com/m1/495590-0-default/login'; // Adjust URL as needed


  login(req : loginReq): Observable<any> {
    return this.http.post<any>(environment.apiUrl, {req });
  }
  logout() {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('tokenExpiry');
    this.token.next('');
    this.loggedIn.next(false);
  }
  isTokenExpired(): boolean {
    const expiry = sessionStorage.getItem('tokenExpiry');
    if (!expiry) {
      return true;
    }
    const now = new Date().getTime();
    return now > parseInt(expiry);
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem('JWT_TOKEN');
}

}
