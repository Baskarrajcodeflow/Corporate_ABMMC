import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {


  private operatorSubject = new BehaviorSubject<any>(null);
  operator$ = this.operatorSubject.asObservable();

  setOperatorData(operator: string) {
    this.operatorSubject.next(operator);
  }
//--------------------------------------------------------------------------------//
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  show() {
    this.loadingSubject.next(true);
    console.log(this.loadingSubject);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  
  public loginSubject = new BehaviorSubject<any>(null);
  login$ = this.loginSubject.asObservable();

  setloginData(login: any) {
    this.loginSubject.next(login);
  }

  
  private currencySubject = new BehaviorSubject<any>(null);
  currency$ = this.currencySubject.asObservable();

  setcurrencyData(currency: any) {
    this.currencySubject.next(currency);
  }

  private tab = new BehaviorSubject<any>(null);
  tab$ = this.tab.asObservable();

  settabData(tab: any) {
    this.tab.next(tab);
  }

  private walletNo = new BehaviorSubject<any>(null);
  walletNo$ = this.walletNo.asObservable();

  setwalletNoData(currency: any) {
    this.walletNo.next(currency);
  }
  public loginNew = new BehaviorSubject<boolean>(false);
  loginnew$ = this.loginNew.asObservable();
  private isBrowser!: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const savedState = sessionStorage.getItem('isLoggedIn');
      if (savedState) {
        this.loginNew.next(JSON.parse(savedState));
      }
    }
  }

  loginSignUp(isLoggedIn: boolean) {
    if (this.isBrowser) {
      this.loginNew.next(isLoggedIn);
      sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }
  }
}
