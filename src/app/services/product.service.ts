import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) { }

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


  public getBreshnaBill(customerId: any) {
    let url = environment.apiUrl + "bill/latestBill?accNo=" + customerId;
    let h: HttpHeaders =  
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
}
