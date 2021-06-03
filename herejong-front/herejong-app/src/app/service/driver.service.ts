import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { ResponseMessage } from '../model/response-message';
import { OrderDetail } from '../model/order-detail';
import { ResponseOrderId } from '../model/response-orderId';
import { Driver } from '../model/driver';
import { DriverUpdate } from '../model/driver-update';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private driverUrl           = 'https://api.herejong.com/user-service/api/driver/create';
  private driverGetUrl           = 'https://api.herejong.com/user-service/api/driver/get';
  private driverGetByIdUrl           = 'https://api.herejong.com/user-service/api/driver/getById';
  private driverRomoveUrl           = 'https://api.herejong.com/user-service/api/driver/remove';
  private driverUpdateUrl           = 'https://api.herejong.com/user-service/api/driver/update';
 

  constructor(private http: HttpClient) { }

  
  driverCreate(driver: Driver): Observable<ResponseMessage> {

    return this.http.post<any>(this.driverUrl , driver, httpOptions);

  }

  driverGet(userId: String): Observable<Driver[]> {

    return this.http.get<Driver[]>(this.driverGetUrl + '/' + userId, { responseType: 'json' });

  }

  driverGetById(id: String): Observable<Driver> {

    return this.http.get<Driver>(this.driverGetByIdUrl + '/' + id, { responseType: 'json' });

  }

  driverReomve(id: String): Observable<any> {
    return this.http.delete(this.driverRomoveUrl + '/' + id , { responseType: 'json' });
  }

  driverUpdate(id: String, driver: DriverUpdate): Observable<any> {
    return this.http.put<any>(this.driverUpdateUrl + '/' + id , driver,httpOptions);
  }


}
