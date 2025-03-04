import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('JWT_TOKEN');
    console.log('authIN');
    console.log('tokenlog'+token);
    
    if (!token) {
      console.log('auth');
      this.router.navigateByUrl('/home');
      return false;
    }
    return true;
  }
}
