import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DatasharingService } from '../services/datasharing.service';
import { environment } from '../../environments/environment';
import { ApiService } from '../B2C/ApiService/api.service';
import { DataSharingService } from '../B2C/dataSharing/data-sharing.service';
import { SessionService } from '../services/session-service/session.service';
import { filter } from 'rxjs';
import { AuthServices } from '../core/authservice.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userName: any;
  userRole: any;
  enail: any;
  phone: any;
  corpType: any;
  imageUrl = environment.apiUrl;
  img: any;
  file1!: File;
  errorMessage: string | null = null;
  onFileSelectedForProfile(event: any) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      const file = event.target.files[0];
      this.file1 = file;
    }

    const input = event.target as HTMLInputElement;
         
    if (input?.files?.length) {
      const file = input.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validTypes.includes(file.type)) {
        console.warn('Invalid file type selected:', file.type);
        this.errorMessage = 'Invalid file type. Please select a valid image'
        input.value = ''; 
      } else {
        console.log('Valid file selected:', file.name);
        this.apiService.submitCorporateProfilePic(this.file1)
        .subscribe((res) => {
          console.log(res);
          if (res?.responseCode == 200) {
              this.showUser = false;
              alert('Profile Picture Changed');
              this.apiService.getUserProfile().subscribe({
                next: (res) => {
                  this.img = res?.data?.profilePic;
                  this.dataSharing.setprofilepicData(res?.data?.profilePic);
                },
                error: () => {
                  alert('Error Try Again');
                },
              });
            }
          });
      }
    }
  }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      this.img = sessionStorage.getItem('profileimg');
    }
    this.dataSharing.profilepic$.subscribe((res) => {
      if (res) {
        this.img = res;
      }
    });

    this.sharedService.loginDeatails$.subscribe((res: any) => {
      if (res)
        (this.userName = `${res?.firstName} ${res?.lastName}`),
          (this.userRole = res?.corpUserRole),
          (this.enail = res?.email),
          (this.corpType = res?.corpType),
          console.log(res, 'userName');
    });
  }
  loggedIn: boolean = false;
  showHomeDashboard: boolean = false;
  showMainTopupButton: boolean = false;
  showAgentSubagentDashboard: boolean = false;
  showSubAgent: boolean = false;

  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public auth: AuthServices,
    private router: Router,
    private data: DatasharingService,
    private dataSharing: DataSharingService,
    private apiService: ApiService,
    private sessionService:SessionService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    console.log(authService.logged,'_++++++++++++=____________+++++++++++++++____________+++++++++++');

  }

  /* showHeaderProfile() : boolean {
  this.authService.isLoggedIn.subscribe(data => {
   alert(data)
    this.loggedIn = data;
    return this.loggedIn;
  })
  return false;
} */

  isDropdownOpen = false;

  navigateTo() {
    this.router.navigateByUrl('/createUser');
  }
  navigateToKYC() {
    this.router.navigateByUrl('/AgentKyc');
  }

  toggleDropdown() {
    // this.isDropdownOpen = !this.isDropdownOpen;
    throw new Error('Method not implemented.');
  }
  switchLanguage(arg0: string) {
    throw new Error('Method not implemented.');
  }
  showWallet: boolean = false;
  showUser: boolean = false;
  showDropdown: boolean = false;

  showDropdownWallet() {
    this.showWallet = !this.showWallet;
    this.showDropdown = this.showUser = false;

    //return (this.showDropdown);
  }
  showDropdownUser() {
    this.showUser = !this.showUser;
    this.showDropdown = this.showWallet = false;
    //return (this.showDropdown);
  }
  showDropdownMenu() {
    this.showDropdown = !this.showDropdown;
  }

  gotoSignup() {
    this.sharedService.toggleSignUp();
  }
  gotoLogin() {
    this.router.navigateByUrl('/login');
    this.data.setloginData(true);
    // this.sharedService.toggleLogin();
  }

  getuserName() {
    return this.sharedService.userName;
  }

  getWalletBalance() {
    return this.sharedService.walletBalance;
  }

  logOut(){
    sessionStorage.clear()
    // this.router.navigate(['/home']).then(() => {
    //   window.location.reload(); // Ensures cached views are cleared
    //   history.pushState(null, '', location.href);
    // });
     if (isPlatformBrowser(this.platformId)) {
          window.history.pushState(null, '', window.location.href);
          // window.onpopstate = () => {
            window.history.pushState(null, '', window.location.href);
            console.log('logout-----------------------------------------');
            
            this.auth.logout();
            window.history.pushState(null, '', window.location.href);
            // this.router.navigate(['/home']);
          // };
    
          // Re-add the state when route changes
          this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
          ).subscribe(() => {
          });
    
    
          this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
          ).subscribe(() => {
            console.log('asdssssssssssssssssssssssssssssssssssssssssssssss');
            history.pushState(null, '', window.location.href);
          });
        }
    this.sessionService.stopTimer(); // Stop auto-logout timer
  }
}
