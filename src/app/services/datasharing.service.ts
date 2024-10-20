import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {

  constructor() { }

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

}
