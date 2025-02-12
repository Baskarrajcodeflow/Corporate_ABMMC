import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KycService {
  constructor(private httpClient: HttpClient) {}
  private apiUrl = environment.apiUrl;
  private getHeaders(): HttpHeaders {
    let token;
    if (sessionStorage) {
      token = sessionStorage.getItem('JWT_TOKEN');
      if (token == null || token == undefined) {
        token = 'Dummy Value';
      }
    }
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  public getCountries() {
    let url = `${environment.apiUrl}/kyc/locations/countries`;
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getprovinces() {
    let url = `${environment.apiUrl}/kyc/locations/provinces`;
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getdistricts(provinceId: any) {
    let url =
      environment.apiUrl +
      '/kyc/locations/provinces/' +
      provinceId +
      '/districts';
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    return this.httpClient.get<any>(url, { headers: h });
  }

  public postKycDetails(body: any) {
    let url = `${environment.apiUrl}/kyc/customer/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    return this.httpClient.post<any>(url, body, { headers: h });
  }

  public b2bSignIp(body: any) {
    let url = `${environment.apiUrl}/um/api/customer/mobile/signUp`;
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    console.log(h);

    return this.httpClient.post<any>(url, body, { headers: h });
  }
}
