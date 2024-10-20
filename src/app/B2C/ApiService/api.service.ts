import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    let token;
    if (localStorage) {
      token = localStorage.getItem("JWT_TOKEN");
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }

  post<T>(endpoint : string, reqPayload : any):Observable<T>{
    console.log(`URL:${environment.apiUrl}${endpoint}`)
     return this.http.post<T>(`${environment.apiUrl}${endpoint}`, reqPayload).pipe(
       catchError(this.handleError<T>(`post ${endpoint}`))
     );
    }
    
  private handleError<T>(operation = 'operation', result?: T) {
    return (error : any) : Observable<T> => {
      console.error(`${operation} failed : ${error.message}`);
      return of(result as T);
    }
  }

  public getUserProfile() {
    let url = environment.apiUrl + "/um/api/corps/profile";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

    public getPayFromAccountDetails(phoneOrWalletNo:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/CurrentBalance?phoneOrWalletNo=${phoneOrWalletNo}&meta=WALLET`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public searchUserToPay(phoneOrWalletNo:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/findUser?phoneOrWalletNo=${phoneOrWalletNo}&meta=WALLET`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public checkFeesAndCommission(phoneOrWalletNo:any,amount:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/getFinalAmount?serviceName=WALLET_TO_WALLET&channel=WALLET&amount=${amount}&walletNo=${phoneOrWalletNo}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public transferMoney(data:any) {
    let url = environment.apiUrl + `/tms/api/tms/router/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url,data, { headers: h });
  }

  public fetchBreshnaBill(accountNo:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/fetchBill?accountNo=${accountNo}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public payBreshnaBill(data:any) {
    let url = environment.apiUrl + `/tms/api/tms/router/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url,data, { headers: h });
  }

  public uploadBulkSalaryFile(serviceName: any,uploadedBy:any,walletId:any,file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/ts/api/bulkUpload/upload?serviceName=${serviceName}&uploadedBy=${uploadedBy}&walletId=${walletId}`;
    return this.http.post<any>(url, file, { headers: h })
  }

  public getUploadBulkSalaryFile(authorizedBy:any,serviceName:any) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/getUploadData?authorizedBy=${authorizedBy}&serviceName=${serviceName}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getUploadBulkSalaryViewData(authorizedBy:any,serviceName:any,metaId:any) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/getDetailsForUploadData?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public authorizeCustomeronboarding(authorizedBy:any,serviceName:any,metaId:any,value:boolean) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/authorizeForCustomerOnboarding?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}&value=${value}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public authorizeSalaryUpload(authorizedBy:any,serviceName:any,metaId:any,value:boolean) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/authorizeForSalaryUpload?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}&value=${value}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }


  public payRequstedBillForAgent(cashOutId:any,value:any,pin:any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/authorizeByApp?cashOutId=${cashOutId}&value=${value}&pin=${pin}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public findWithdrawal(customerId:any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/findWithdrawalReq?id=${customerId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public changePassword(data: any) {
    let url = `${environment.apiUrl}/um/api/bo/changePassword`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url,data, { headers: h });
  }

  public verifyOtp(body: any) {
    let url = `${environment.apiUrl}/um/api/otp/verify`;
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    console.log(h);

    return this.http.post<any>(url, body, { headers: h });
  }

  public forgotOtp(body: any) {
    let url = `${environment.apiUrl}/um/api/otp/forgotPassword`;
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    console.log(h);
    return this.http.post<any>(url, body, { headers: h });
  }

    // Transaction History
public getTranasctionHistory(walletNo: any,trxnType:any,fromDate:any,toDate:any) {
  let url = environment.apiUrl + `/ts/api/transaction-services/getFilteredHistory?walletNo=${walletNo}&trxnType=${trxnType}&fromDate=${fromDate}&toDate=${toDate}`;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.http.get<any>(url, { headers: h })
}

public getCorpUsers() {
  let url = environment.apiUrl + `/um/api/corps/getCorpUsers`;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.http.get<any>(url, { headers: h })
}

}
