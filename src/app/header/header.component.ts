import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { DatasharingService } from '../services/datasharing.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, CommonModule,RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userName: any;
  userRole: any;
  enail: any;
  phone: any;
  corpType: any;

  ngOnInit(): void {
      this.sharedService.loginDeatails$.subscribe((res:any)=>{
        if(res)
        this.userName = `${res?.firstName} ${res?.lastName}`,
      this.userRole = res?.corpUserRole,
      this.enail = res?.email,
      this.corpType = res?.corpType,
      console.log(res,'userName');
      
      })
  }
  loggedIn: boolean = false;
  showHomeDashboard: boolean = false;
  showMainTopupButton: boolean = false;
  showAgentSubagentDashboard: boolean = false;
  showSubAgent: boolean = false;

  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    private router: Router,
    private data:DatasharingService
  ) { }

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
  navigateToKYC(){
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
    this.data.setloginData(true)
    // this.sharedService.toggleLogin();
  }

  getuserName() {
    return this.sharedService.userName;
  }

  getWalletBalance() {
    return this.sharedService.walletBalance;
  }
}
