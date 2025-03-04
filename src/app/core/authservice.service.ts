import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api/api.service';
import { StorageService } from './storage.service';
import { SessionService } from '../services/session-service/session.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private readonly JWT_TOKEN = "JWT_TOKEN";
  token!: string;

  constructor(private apiService:ApiService,private router:Router, private storageService:StorageService,private sessionService:SessionService) { }
  endpoint: string = "";
  currentUser = signal<string>("");

  login(username: string, password: string,otp:string): Observable<any> {
      this.endpoint = "/aaa/corps/login";
    return this.apiService.post(this.endpoint, { username, password,otp }).pipe(
      tap((response: any) => {
        // let tokens = JSON.stringify(response);
        this.doLoginUser(username, response.token);
      })
    );
  }
  doLoginUser(userName: string, tokens: any) {
    this.currentUser.set(userName);
    this.storeToken(tokens);
    // this.router.navigate(["/CustomerComponent"]);
  }
  storeToken(jwt: string) {
    console.log('Timer Stsrted');
    
    sessionStorage.setItem(this.JWT_TOKEN, jwt);
    this.token = jwt;
  }

  getAuthToken(): string | null {
    return this.storageService.getItem('JWT_TOKEN');

}

logout(): void {
  console.log('Timer End');
  sessionStorage.clear() // Clear session
  this.sessionService.stopTimer(); // Stop auto-logout timer
  // this.router.navigate(['/home']);
  // alert('Session expired. Logging out...')
  // this.router.navigate(['/home']);
  window.location.reload()
  window.history.back()
}

logoutExpiry(): void {
  console.log('loggin');
  
  console.log('Timer End');
  sessionStorage.clear() // Clear session
  this.sessionService.stopTimer(); // Stop auto-logout timer
  // this.router.navigate(['/home']);
  alert('Session expired. Logging out...')
  // this.router.navigate(['/home']);
  window.location.reload()
  window.history.back()
}


isLoggedIn(): boolean|any {
  return sessionStorage.getItem('JWT_TOKEN');
}

}
