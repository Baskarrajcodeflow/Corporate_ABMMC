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

  public resetPwd(body: any) {
    let url = `${environment.apiUrl}/um/api/pwd/forgot`;
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

public getAuthorizedCorporate() {
  let url = `${environment.apiUrl}/um/api/bo/getAllAuthorizedCorps`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get<any>(url, { headers: h });
}

public approveOrRejectUploadedFiles(id: any,value:any,rejectReason:any) {
  let url = `${environment.apiUrl}/salary/api/files/approveByCorpUser?id=${id}&value=${value}&rejectReason=${rejectReason}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get(url, {
    headers: h,
  });
}

public getAllUploadedFiles(corpId:any) {
  let url = `${environment.apiUrl}/salary/api/files/getByCorpAll?corpId=${corpId}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get(url, {
    headers: h,
  });
}



public completedSalaryTransactionReport(id:any) {
  let url = `${environment.apiUrl}/salary/api/getFinalStatus?id=${id}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get(url, {
    headers: h,
  });
}
public kycProofUpload(file1: FormData, corpId: any) {
  let h: HttpHeaders = this.getHeaders();
  let url = `${environment.apiUrl}/salary/api/upload?corpId=${corpId}`;
  return this.http.post<any>(url, file1, { headers: h });
}

public reUploadFile(file1: FormData, corpId: any) {
  let h: HttpHeaders = this.getHeaders();
  let url = `${environment.apiUrl}/salary/api/files/${corpId}/reupload`;
  return this.http.put<any>(url, file1, { headers: h });
}

public uploadedFileReport(id:any,fileType:any) {
  let url = `${environment.apiUrl}/salary/api/files/report?id=${id}&fileType=${fileType}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get(url, {
    headers: h,
  });
}

public rejectUploadedFiles(id: any, reason: any) {
  let url = `${environment.apiUrl}/salary/api/files/reject?id=${id}&reason=${reason}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get(url, {
    headers: h,
  });
} 

//-----------------------------------Corporate----------------------------------//
public submitCorporateRegister(req: any) {
  let url = `${environment.apiUrl}/um/api/corps/mobile/signUpForCorporate`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.post<any>(url, req, { headers: h });
}

public submitCorporateRegisterKYC(req: any) {
  let url = `${environment.apiUrl}/kyc/corporate/submit`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.post<any>(url, req, { headers: h });
}
//corpFile
public submitCorporateKYCFiles(id: any, mapping: any, fileToUpload: File) {
  let h: HttpHeaders = this.getHeaders(); 
  const formData = new FormData(); 
  formData.append('file', fileToUpload); 
  let url = `${environment.apiUrl}/kyc/corporate/uploadImage?corpId=${id}&mapping=${mapping}`;
  return this.http.post<any>(url, formData, { headers: h });
}
public submitCorporateKYCShareholderFiles( mapping: any,corpId:any,shareholderId:any, fileToUpload: File) {
  let h: HttpHeaders = this.getHeaders(); 
  const formData = new FormData(); 
  formData.append('file', fileToUpload); 
  let url = `${environment.apiUrl}/kyc/corporate/uploadImage?mapping=${mapping}&corpId=${corpId}&shareholderId=${shareholderId}`;
  return this.http.post<any>(url, formData, { headers: h });
}
public completeRegisterKYC(id: any, ) {
  let url = `${environment.apiUrl}/kyc/corporate/complete?corpId=`+id;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.post<any>(url,  { headers: h });
}
// public submitCorporateKYCFiles(id: any, mapping:any) {
//   let h: HttpHeaders = this.getHeaders();
//   const file = new FormData();
//   let url = `${environment.apiUrl}/kyc/corporate/uploadImage?corpId=`+id`$mapping=`+mapping;
//   return this.httpClient.post<any>(url, file, { headers: h })
//   //old
//   // let url = `${environment.apiUrl}/kyc/corporate/uploadImage?corpId=`+id`$mapping=`+mapping;
//   // let h: HttpHeaders = this.getHeaders().set(
//   //   "Content-Type",
//   //   "application/json"
//   // );
//   // console.log(url);
//   // return this.httpClient.post<any>(url,  { headers: h });
// }
public submitMasterRegister(req: any) {
  let url = `${environment.apiUrl}/registerMaster`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.post<any>(url, req, { headers: h });
}
public agentRegister(req: any) {
  let url = `${environment.apiUrl}/um/api/bo/registerAgent`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.post<any>(url, req, { headers: h });
}
public authorizeCorporateUsers(id: any) {
  let url = `${environment.apiUrl}/um/api/bo/activateBackOffice?id=` + id;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.get<any>(url, { headers: h });
}
public rejectCorporateUsers(id: any) {
  let url = `${environment.apiUrl}/um/api/bo/deleteAcc?userId=` + id;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);
  return this.http.get<any>(url, { headers: h });
}
public deactivateCorporateUsers(id: any) {
  let url = `${environment.apiUrl}/um/api/bo/deactivateAcc?userId=` + id;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.get<any>(url, { headers: h });
}
public addSuperAgentPhoto(file1: File, fieldname: any, photoId: any) {
  let h: HttpHeaders = this.getHeaders();
  const file = new FormData();
  file.append('file', file1);
  // file.append('customerKycId', photoId)
  // file.append('type', customerData)
  let url = `${environment.apiUrl}/kyc/super/uploadAttachment?mapping=` + fieldname + `&submittedFor=` + photoId;
  return this.http.post<any>(url, file, { headers: h })
}
public addSuperAgentSign(file1: File, fieldname: any, photoId: any) {
  let h: HttpHeaders = this.getHeaders();
  const file = new FormData();
  file.append('file', file1);
  // file.append('customerKycId', photoId)
  // file.append('type', customerData)
  let url = `${environment.apiUrl}/kyc/super/uploadAttachment?mapping=` + fieldname + `&submittedFor=` + photoId;
  return this.http.post<any>(url, file, { headers: h })
}
public getAllFirmType() {
  let url = `${environment.apiUrl}/kyc/common/getAllFirmType`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.get<any>(url, { headers: h });
}
public getprovinces() {
  let url = `${environment.apiUrl}/kyc/locations/provinces`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.get<any>(url, { headers: h });
}

public getdistricts(provinceId: any) {
  let url = `${environment.apiUrl}/kyc/locations/provinces/` + provinceId + `/districts`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);
  return this.http.get<any>(url, { headers: h })
}

public getCountries() {
  let url = `${environment.apiUrl}/kyc/locations/countries`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.get<any>(url, { headers: h });
}

public getAccStatement(wallet: any, fromDate: any, toDate: any) {
  let url = `${environment.apiUrl}/ts/api/transaction-services/accStmt?wallet=${wallet}&fromDate=${fromDate}&toDate=${toDate}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get(url, {
    headers: h,
  });
}
}
