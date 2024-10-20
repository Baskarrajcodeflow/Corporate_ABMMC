import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { emailVerificationReq, otpVerificationReq } from '../../interfaces/interfaces';
import * as CryptoJS from 'crypto-js';

import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,TranslateModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  phone : string = ''
  email : string = ''
  emailPattern  =   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  timer !: number;
  currentView:  'otpVerification' | 'signup'  = 'signup';  result: any;
  otP: any;
  emailVerificationReq!: emailVerificationReq ;
  key: any;
  salt: any;
  response: any;
  decryptResult: any;
  decryptedText: any;
  otpVerificationReq!: otpVerificationReq;
  otpDigits: string[] = ['', '', '', '', '', ''];
  otpResponse: any;
  otp: any;

  constructor( private sharedService : SharedService, private loginService:LoginService , private router : Router){

  }
  ngOnInit(){

    this.key = "DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A";
    this.salt = "f9Nj*7ZjK!5qJiV@*bIC%5b$7305EDAeZRYy8PYa95!9&ur50";

  }

  close(){
    this.sharedService.closeSignUp();
  }

  signup(){
  }
  
  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.key;
    if(isNaN((Number(charCode)))){
      event.preventDefault();
    }   
  }
  switchView(view: 'otpVerification' | 'signup' ) {
    this.currentView = view;
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

  decrypt(encryptedData: string, iv: string) {
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

  onDigitInput(index: number, event: any) {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      // Update the corresponding digit in the array
      this.otpDigits[index] = value;
    } else {
      // Clear the input if it's not a digit
      this.otpDigits[index] = '';
    }
  }

  verifyOtp() {
    this.otp = this.otpDigits.join('');
    this.otpVerificationReq = {
      email: this.email,
      otp: this.otp,
    }
    this.result = this.encryptMessage(JSON.stringify(this.otpVerificationReq));
    let encryptedReq = { "mlabs": this.result.iv, "info": this.result?.encryptedText }
    this.loginService.verifyEmailOTP(encryptedReq).subscribe((response: any) => {
      this.otpResponse = response;
      this.decryptResult = this.decrypt(response?.info, response.mlabs);
      this.decryptedText = JSON.parse(this.decryptResult?.decrptedText);
      if (this.decryptedText?.code == 100) {
        alert(this.decryptedText?.message);
        this.sharedService.closeSignUp();
        this.router.navigate(['/registration']);
      }
      else {
        alert("Error");
      }
    })
  }

  requestOtp() {
    this.emailVerificationReq = {
      email: this.email,
      otp: null,
    }
    this.result = this.encryptMessage(JSON.stringify(this.emailVerificationReq));
    let encryptedReq = { "mlabs": this.result.iv, "info": this.result?.encryptedText }
    this.loginService.sendVerifyEmailOTP(encryptedReq).subscribe((response: any) => {
      this.response = response;
      this.decryptResult = this.decrypt(response?.info, response.mlabs);

      this.decryptedText = JSON.parse(this.decryptResult?.decrptedText);
      if (this.decryptedText?.code == 100) {
        alert(this.decryptedText?.message);
      }
    })
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

}
