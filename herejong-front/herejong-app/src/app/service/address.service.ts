import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Province } from '../model/province';

const TOKEN_KEY = 'ProvinceStorage';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AddressService {



  private provinceUrl = 'https://api.herejong.com/customer-service/api/customer/getProvince';

  
  constructor(private http: HttpClient) { }



  getProvince(): Observable<Province> {

    return this.http.get<Province>(this.provinceUrl , { responseType: 'json' });

  }

  getProvinceArray(): Observable<Province[]> {

    return this.http.get<Province[]>(this.provinceUrl , { responseType: 'json' });

  }

  public saveProvinceStorage(procince: Province[]) {

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(procince));


  }

  public getProvinceStorage(): Province[] {

    return JSON.parse(sessionStorage.getItem(TOKEN_KEY));

  }




}
