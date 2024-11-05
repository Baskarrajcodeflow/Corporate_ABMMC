import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { loginReq } from '../../interfaces/interfaces';
import { LoginService } from '../../services/login.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AuthServices } from '../../core/authservice.service';
import { OurServicesComponent } from '../../components/Our-Services/our-services.component';
import { ApiService } from '../ApiService/api.service';
import { DatasharingService } from '../../services/datasharing.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterCorporateComponent } from '../corporate-register/register-corporate/register-corporate.component';
import { DataSharingService } from '../dataSharing/data-sharing.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    OurServicesComponent,
    MatSnackBarModule,
    RegisterCorporateComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  //login data
  loginForm: FormGroup = new FormGroup({});
  loginReq!: loginReq;
  phone: string = '';
  password: string = '';

  //forget password
  email: string = '';
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  currentView: 'login' | 'forgotPassword' | 'otpVerification' | 'newPassword' | 'OTP' | 'OTPVerify' | 'resetPwd' =
    'login';
  result: any;
  key: any;
  salt: any;
  response: any;
  decryptResult: any;
  decryptedText: any;
  tokenData: any;
  timer!: number;
  customerId: any;
  loginId: any;
  openModal: boolean = true;
  oldpassword: any;
  newpassword: any;
  resetPwdData:any= false
  otpVerify: any;
  otp: any;
  resetPwd: any;
  loginformData: any;
  value: any;
  oldpasswordreset: any;
  newpasswordreset: any;
otpnew: any;
newPassword: any;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private authService: AuthServices,
    private loginService: LoginService,
    private router: Router,
    private auth: AuthService,
    private apiService: ApiService,
    private dataSharing: DatasharingService,
    private dataSharingService: DataSharingService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.dataSharingService.corpKyc$.subscribe((res) => {
      this.viewCorporateRegister = res;
    });
    this.key = 'DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A';
    this.salt = 'f9Nj*7ZjK!5qJiV@*bIC%5b$7305EDAeZRYy8PYa95!9&ur50';
  }

  closeModal() {
    this.openModal = false;
  }

  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.key;
    if (isNaN(Number(charCode))) {
      event.preventDefault();
    }
  }

  // Function to encrypt a message using PKCS#7 padding and IV
  encryptMessage(message: string): { encryptedText: string; iv: string } {
    const iv = CryptoJS.lib.WordArray.random(16);

    const derivedKey = CryptoJS.PBKDF2(this.key, this.salt, {
      keySize: 256 / 32, // Derive 256-bit key
      iterations: 65536, // Increase iterations for stronger derivation
    });

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(message),
      derivedKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return {
      encryptedText: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Base64),
    };
  }

  decrypt(encryptedData: string, iv: string) {
    const ivString = CryptoJS.enc.Base64.parse(iv).toString();

    // Derive the key using the salt
    var derivedKey = CryptoJS.PBKDF2(this.key, this.salt, {
      keySize: 256 / 32,
      iterations: 65536,
    });

    // Decrypting the data with the derived key and IV
    var decryptedBytes = CryptoJS.AES.decrypt(encryptedData, derivedKey, {
      iv: CryptoJS.enc.Hex.parse(ivString),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      decrptedText: decryptedBytes.toString(CryptoJS.enc.Utf8),
    };
  }
  credentials = {
    username: '',
    password: '',
  };
  username: any = null;
  passwords: any = null;
  changePassword: boolean = false;

  login() {
    this.credentials.username = this.username;
    this.credentials.password = this.passwords;
    this.authService.login(this.username, this.password).subscribe({
      next: (v: any) => {
        console.log(v);
        if (v?.responseCode == 200) {
          alert('Success');
          this.openModal = false;
          this.auth.logged = true;
          this.getProfileData();
          let token = v?.token;
          this.snackBar.open('Success', 'Close', {
            duration: 5000,
            panelClass: ['mdc-snackbar__surface'],
          });

          const helper = new JwtHelperService();
          let decodedToken = helper.decodeToken(JSON.stringify(token));
          // console.log(decodedToken);
          this.router.navigateByUrl('/dashboard');
        } else if (v?.responseCode == 2) {
          this.currentView = 'newPassword';
          this.changePassword = true;
          alert(v?.message);
        } else {
          alert(v?.message);
        }
      },
      error: () => {
        alert('Something Went Wrong');
      },
    });
  }

  getProfileData() {
    this.apiService.getUserProfile().subscribe((res) => {
      console.log(res);
      this.sharedService.liginDeatilsData(res?.data);
      sessionStorage.setItem('SenderUserId', res?.data?.id);
      sessionStorage.setItem(
        'profileWalletNo',
        res?.data?.walletAccount?.walletNo
      );
      sessionStorage.setItem('walletId', res?.data?.walletAccount?.id);
      sessionStorage.setItem(
        'basrUserId',
        res?.data?.walletAccount?.baseUserId
      );
      sessionStorage.setItem('Role', res?.data?.corpUserRole);
      sessionStorage.setItem('Kyclevel', res?.data?.accountKycLevel);
      this.dataSharingService.setkyclevelData(res?.data?.accountKycLevel);

      this.apiService
        .getPayFromAccountDetails(res?.data?.walletAccount?.walletNo)
        .subscribe((res) => {
          console.log(res);
          this.dataSharing.setcurrencyData(res?.data);
          sessionStorage.setItem('WalletAmount', res?.data);

          // this.dataSharing.currentBalanceData(res?.data)
        });
    });
  }
  navigate() {
    this.router.navigateByUrl('signUp');
  }
  viewCorporateRegister: boolean = false;
  gotoRegister(event: any) {
    this.viewCorporateRegister = event;
  }

  changePasswordApi() {
    let body = {
      oldPassword: this.oldpassword,
      newPassword: this.newpassword,
    };
    console.log(body);

    this.apiService.changePassword(body).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          alert(res?.data);
          this.changePassword = false;
        } else {
          alert(res?.error);
        }
      },
    });
  }

  switchView(
    view: 'login' | 'forgotPassword' | 'otpVerification' | 'newPassword' | 'OTP' | 'OTPVerify' | 'resetPwd'
  ) {
    this.currentView = view;
  }

  sendOtp() {
    let body = {
      email: this.email,
      userType: 'CORPORATE',
    };
    this.dataSharing.show();
    this.apiService.forgotOtp(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.dataSharing.hide();
          this.otpVerify = false;
          this.resetPwd = false;
          this.loginformData = false;
          this.otpVerify = true;
          this.value = false;
          this.currentView = 'OTPVerify'
          alert('OTP has sent to your mail');
        } else {
          this.dataSharing.hide();
          alert(res?.error);
        }
      },
      error: () => {
        this.dataSharing.hide();
        alert('Error Try Again');
      },
    });
  }
  onSaveOtp() {
    let email = this.email;

    let body = {
      email: email,
      otp: this.otp,
    };
    this.apiService.verifyOtp(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.resetPwdData = true;
          this.otpVerify = false;
          this.resetPwdData = true;
          this.currentView = 'resetPwd'
          this.dataSharing.hide();
          alert('OTP Verified Successfully');
        } else {
          alert(res?.error);
        }
      },
      error: () => {
        this.dataSharing.hide();
        alert('Error Try Again');
      },
    });
  }
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${paddedMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    /*  this.authService.loggedIn.next(false);
    this.authService.logged = false; */
    this.openModal = false;
  }

  resetPwdApi() {
    let data = {
      email:this.username,
      userType: 'CORPORATE',
    };
    this.apiService.forgotOtp(data).subscribe({
      next: (res) => {
        console.log(res);
        if(res?.responseCode == 200){
          alert('OTP has sent to your mail.Confirm it to change Password')
          this.currentView = 'OTP'
        }else{
          alert(res?.error)
        }
      },error:()=>{
        alert('Something Went Wrong')
      }
    });
  }

  setNewpwd() {
    let data = {
      email:this.username,
      password:this.newpasswordreset,
      userType: 'CORPORATE',
      otp:this.otpnew
    };
    this.apiService.resetPwd(data).subscribe({
      next: (res) => {
        console.log(res);
        if(res?.responseCode == 200){
          alert('Password Changed Successfully')
          this.currentView = 'login'
        }else{
          alert(res?.error)
        }
      },error:()=>{
        alert('Something Went Wrong')
      }
    });
  }

  pwdReset() {
    let body = {
      email: this.email,
      password: this.newPassword,
      userType:'CORPORATE'
    };
    console.log(body);
    
    this.dataSharing.show()
    this.apiService.forgotOtp(body).subscribe({
      next:(res)=>{
          if(res?.responseCode == 200){
            alert('Password Reset Successful')
            this.dataSharing.hide()
            // this.otpVerify = false
            this.resetPwdData = false;
            // this.resetPwd = false;
            setTimeout(() => {
              this.value = true
              this.currentView = 'login';
              console.log("Current View after password reset:", this.currentView);
              // this.cdr.detectChanges();
            }, 0); 
          }else{
            this.dataSharing.hide()
            alert(res?.error)
          }
      },error:()=>{
        this.dataSharing.hide()
        alert('Error Try Again')
      }
    })
  }
}
