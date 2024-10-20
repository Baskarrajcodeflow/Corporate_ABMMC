import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, takeWhile, timer } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private showSignupCardSubject = new BehaviorSubject<boolean>(false);
  showSignupCard$ = this.showSignupCardSubject.asObservable();

  private showLoginCardSubject = new BehaviorSubject<boolean>(false);
  showLoginCard$ = this.showLoginCardSubject.asObservable();

  private loginDeatails = new BehaviorSubject<boolean>(false);
  loginDeatails$ = this.loginDeatails.asObservable();

  liginDeatilsData(data:any){
    this.loginDeatails.next(data)
  }
  
  public userName : string = '';
  public walletBalance : number = 0.00;
  public walletNo : string = '';

  public customerId : number = 0;

  key: any = "DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A";
  salt: any = "f9Nj*7ZjK!5qJiV@*bIC%5b$7305EDAeZRYy8PYa95!9&ur50";


  
  private timer$ !: Observable<number>;

  constructor() { }

  toggleSignUp(){
    this.showSignupCardSubject.next(true);   

  }
  closeSignUp(){
    this.showSignupCardSubject.next(false);
  }
  toggleLogin(){
    this.showLoginCardSubject.next(true);  
    
  }
  closeLogin(){
    this.showLoginCardSubject.next(false);
  }

  startTimer(minute: number) {
    this.timer$ = timer(0, 1000).pipe(
      map((secondsElapsed: number) => (minute * 60) - secondsElapsed),
      takeWhile((secondsRemaining: number) => secondsRemaining >= 0)
    );
  }

  getTimer() : Observable<number>{
    return this.timer$;

  }

  encryptMessage(message: string): { info: string, mlabs: string } {
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
     info: encrypted.toString(),
     mlabs: iv.toString(CryptoJS.enc.Base64),
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
}
