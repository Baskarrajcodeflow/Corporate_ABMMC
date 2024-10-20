import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateModule } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/authservice.service';
import { loginReq } from '../../../interfaces/interfaces';
import { LoginService } from '../../../services/login.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  //login data
  loginForm: FormGroup = new FormGroup({});
  loginReq !: loginReq ;
  phone : string = ''
  password : string = ''

  //forget password
  email : string = ''
  emailPattern  =   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  currentView: 'login' | 'forgotPassword' | 'otpVerification' | 'newPassword'  = 'login';  result: any;
  key: any;
  salt: any;
  response: any;
  decryptResult: any;
  decryptedText: any;
  tokenData: any;
  timer !: number;
  customerId: any;
  loginId: any;

  constructor(private sharedService : SharedService, private fb : FormBuilder, private authService : AuthServices, private loginService:LoginService, private router : Router) {

  }
  ngOnInit() {
    this.key = "DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A";
    this.salt = "f9Nj*7ZjK!5qJiV@*bIC%5b$7305EDAeZRYy8PYa95!9&ur50";
  }
 

  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.key;
    if(isNaN((Number(charCode)))){
      event.preventDefault();
    }   
  }

// Function to encrypt a message using PKCS#7 padding and IV
encryptMessage(message: string): { encryptedText: string, iv: string } {
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

decrypt(encryptedData:string, iv:string) {
  const ivString = CryptoJS.enc.Base64.parse(iv).toString();

  // Derive the key using the salt
  var derivedKey = CryptoJS.PBKDF2(this.key, this.salt, { 
    keySize: 256 / 32, 
    iterations: 65536 
  });

  // Decrypting the data with the derived key and IV
  var decryptedBytes = CryptoJS.AES.decrypt(
    encryptedData,
    derivedKey, {
    iv: CryptoJS.enc.Hex.parse(ivString),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    decrptedText: decryptedBytes.toString(CryptoJS.enc.Utf8)
  }
}
credentials = {
  username: "",
  password: "",
};
username: any = null;
passwords: any = null;
  login(){
    this.credentials.username = this.username;
    this.credentials.password = this.passwords;
    this.authService
      .login(this.username, this.password)
      .subscribe({
        next: (v: any) => {
          console.log(v);
        
          let token = v?.token;
          const helper = new JwtHelperService();
          let decodedToken = helper.decodeToken(JSON.stringify(token));
       
        },
      });
  
  }

  
  switchView(view: 'login' | 'forgotPassword' | 'otpVerification' | 'newPassword' ) {
    this.currentView = view;
  }

  sendOtp(){
    this.switchView('otpVerification');
    this.sharedService.startTimer(5);
    this.sharedService.getTimer().subscribe(response => {
      this.timer = response;

    })

  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${paddedMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }


  ngOnDestroy(){
   /*  this.authService.loggedIn.next(false);
    this.authService.logged = false; */


  }

  


}
