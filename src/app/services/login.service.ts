import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/base-response';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private getHeaders(): HttpHeaders {
    let token ;
    if(sessionStorage){
       token = sessionStorage.getItem('token');
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }

    }
    
    return new HttpHeaders()
      .set("Authorization", "Bearer " + token);
  }

  private apiUrl: String = environment.apiUrl;
  private headers: HttpHeaders = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Access-Control-Allow-Origin", "http://75.101.194.87:8080s")
    .set("Accept", "application/json");
  public signin(req: any) {
    let url = environment.apiUrl + "mipay/login";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public getCustomerProfile(customerId: any) {
    let url = environment.apiUrl + "profile/getCustomerProfile?customerId=" + customerId;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
 
  public nationalities() {
    let url = environment.apiUrl + "app/nationalities";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getAllProvince() {
    let url = environment.apiUrl + "app/getAllProvince";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getAllOccupation() {
    let url = environment.apiUrl + "app/getAllOccupation";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public countries() {
    let url = environment.apiUrl + "app/countries";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public languages() {
    let url = environment.apiUrl + "app/languages";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  
  public addCustomer(req: any) {
    let url = environment.apiUrl + "app/addCustomer";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<BaseResponse>(url, req, { headers: h })
  }
 
  public checkWallet(phone:any) {
    let url = environment.apiUrl + "app/checkWallet?phone="+phone;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public sendVerifyEmailOTP(req: any) {
    let url = environment.apiUrl + "email/sendVerifyEmailOTP";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<BaseResponse>(url, req, { headers: h })
  }
  public verifyEmailOTP(req: any) {
    let url = environment.apiUrl + "app/verifyEmailOTP";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<BaseResponse>(url, req, { headers: h })
  }

  public getBalance(accountNo:any, userType: string) {
    let url = environment.apiUrl + "transaction/getBalance?accountNo="+accountNo+"&userType="+userType;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }

  public addBankDetails(req: any) {
    let url = environment.apiUrl + "aps_card/addBankDetails";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<BaseResponse>(url, req, { headers: h })
  }

  public findFeesAndCommissionFPW(req: any) {
    let url = environment.apiUrl + "aub/findFeesAndCommissionFPW";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<BaseResponse>(url, req, { headers: h })
  }

 

 
// Breshna Payments Api
public breshnaBillPayment(req: any) {
  let url = environment.apiUrl + "bill/breshnaPaymentPost";
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.httpClient.post<any>(url, req, { headers: h })
}

// Air Time TOP UP
public airTimeTopUp(req: any) {
  let url = environment.apiUrl + "topup/rechargeTopUp";
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.httpClient.post<any>(url, req, { headers: h })
}

// Transaction History
public getTranasctionHistory(req: any,page:any) {
  let url = environment.apiUrl + `moneyTransfer/getRecentTransactions?page=${page}&size=5`;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.httpClient.post<any>(url, req, { headers: h })
}

// Add Money
public getBankAndApsCard( userId: number) {
  let url = environment.apiUrl + "aps_card/getBankAndApsCard?userId="+userId;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.httpClient.get<any>(url, { headers: h })
}

public AddMoneyRequest(req: any) {
  let url = environment.apiUrl + `aub/pullService`;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.httpClient.post<any>(url, req, { headers: h })
}
  constructor(private httpClient: HttpClient) { }
}
