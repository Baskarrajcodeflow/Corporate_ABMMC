import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { AuthServices } from '../../core/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionTimeout = 3600 * 1000; // 20 seconds
  private timerSubscription: Subscription | null = null;
  private authService!: AuthServices; 

  constructor(private router: Router, private injector: Injector) {}

  private getAuthService(): AuthServices {
    if (!this.authService) {
      this.authService = this.injector.get(AuthServices);
    }
    return this.authService;
  }

  startTimer(): void {
    this.stopTimer(); // Properly clears previous timer before starting a new one
    this.timerSubscription = timer(this.sessionTimeout).subscribe(() => {
      console.log('new');
      
      this.logoutUser();
    });
  }

  resetTimer(): void {
    this.stopTimer(); // Stops any existing timer before restarting
    this.startTimer(); 
  }

  logoutUser(): void {
    this.getAuthService().logoutExpiry(); 
    // this.router.navigate(['/home']);
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null; 
    }
  }
}
