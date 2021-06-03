import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Province } from '../model/province';
import { ResponseMessage } from '../model/response-message';
import { ProductStar } from '../model/product-star';
import { DriverStar } from '../model/driver-star';
import { StarForm } from '../model/star-form';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
}) 
export class StarService {


  private starAllUrl = 'https://api.herejong.com/customer-service/api/star/all';
  private starDriverUrl = 'https://api.herejong.com/customer-service/api/star/driver';
  private starProductUrl = 'https://api.herejong.com/customer-service/api/star/product';
  private updateOrderUrl = 'https://api.herejong.com/customer-service/api/star/update/order';
  
  constructor(private http: HttpClient) { }

  saveStarAll(starForm: StarForm): Observable<ResponseMessage> {

    return this.http.post<any>(this.starAllUrl ,starForm, { responseType: 'json' });

  }

  saveStarDriver(starDriverForm: DriverStar): Observable<ResponseMessage> {

    return this.http.post<any>(this.starDriverUrl ,starDriverForm, { responseType: 'json' });

  }

  saveStarProduct(starProductForm : ProductStar): Observable<ResponseMessage> {

    return this.http.post<any>(this.starProductUrl ,starProductForm, { responseType: 'json' });

  }

  orderUpdate(id: String): Observable<any> {
    return this.http.put<any>(this.updateOrderUrl + '/' + id ,httpOptions);
  }


}
