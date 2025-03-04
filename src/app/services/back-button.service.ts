import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthServices } from '../core/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {
  constructor(
    private router: Router,
    private authService: AuthServices,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    console.log('++++++++++++++++++++++++++++++++++++++++++++++');

    if (isPlatformBrowser(this.platformId)) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, '', window.location.href);
        console.log('logout-----------------------------------------');
        
        this.authService.logout();
        // this.router.navigate(['/home']);
      };

      // Re-add the state when route changes
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        window.history.pushState(null, '', window.location.href);
      });


      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        console.log('asdssssssssssssssssssssssssssssssssssssssssssssss');
        history.pushState(null, '', window.location.href);
      });
    }
  }
}
