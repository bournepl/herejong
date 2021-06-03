import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { ResponseMessage } from '../model/response-message';
import { OrderDetail } from '../model/order-detail';
import { OrderImage } from '../model/order-image';
import { ResponseOrderId } from '../model/response-orderId';
import { OrderDetailGet } from '../model/order-detail-get';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService { 

  private orderUrl              = 'https://api.herejong.com/customer-service/api/customer/order';
  private orderImageUrl         = 'https://api.herejong.com/customer-service/api/customer/order/image';
  private getOrderUrl           = 'https://api.herejong.com/customer-service/api/customer/getOrder/';
  private orderSuccessUrl       = 'https://api.herejong.com/customer-service/api/customer/order/success/';
  private sendMulticastUrl      = 'https://api.herejong.com/customer-service/api/customer/sendMulticast/';

  private getOrderUserUrl               = 'https://api.herejong.com/user-service/api/user/order/get/';
  private getOrderUserHistoryUrl        = 'https://api.herejong.com/user-service/api/user/order/get/history/';

  private getOrderUserUrlcustomer               = 'https://api.herejong.com/customer-service/api/customer/order/get/';
  private getOrderUserHistoryUrlcustomer        = 'https://api.herejong.com/customer-service/api/customer/order/get/history/';
  private getOrderUserHistoryStarUrl        = 'https://api.herejong.com/customer-service/api/customer/order/get/history/star/';

  private uploadPictureUrl               = 'https://api.herejong.com/customer-service/api/customer/order/upload/image';

  constructor(private http: HttpClient) { }
 

  getOrdeCustomer(customerId :string): Observable<OrderDetailGet[]> {

    return this.http.get<OrderDetailGet[]>(this.getOrderUserUrlcustomer + customerId, { responseType: 'json' } );

  }

  getOrderHistoryCustomer(customerId :string): Observable<OrderDetailGet[]> {

    return this.http.get<OrderDetailGet[]>(this.getOrderUserHistoryUrlcustomer + customerId, { responseType: 'json' } );

  }

  getOrderHistoryCustomerStar(customerId :string): Observable<any[]> {

    return this.http.get<any[]>(this.getOrderUserHistoryStarUrl + customerId, { responseType: 'json' } );

  }

  
  getOrderByUserId(userId :string): Observable<OrderDetailGet[]> {

    return this.http.get<OrderDetailGet[]>(this.getOrderUserUrl + userId, { responseType: 'json' } );

  }

  getOrderByUserIdHistory(userId :string): Observable<OrderDetailGet[]> {

    return this.http.get<OrderDetailGet[]>(this.getOrderUserHistoryUrl + userId, { responseType: 'json' } );

  }


  
  orderCreate(orderDetail: OrderDetail): Observable<ResponseOrderId> {

    return this.http.post<any>(this.orderUrl , orderDetail, httpOptions);

  }

  orderCreateImage(orderImage: OrderImage): Observable<ResponseOrderId> {

    return this.http.post<any>(this.orderImageUrl , orderImage, httpOptions);

  }

  getOrder(orderId :string): Observable<OrderDetail> {

    return this.http.get<OrderDetail>(this.getOrderUrl + orderId, { responseType: 'json' } );

  }

  orderCreateSuccess(customerId : string): Observable<ResponseMessage> {

    return this.http.post<any>(this.orderSuccessUrl + customerId , httpOptions);

  }

  sendMulticast(orderId :string): Observable<ResponseMessage> {
  
    return this.http.post<any>(this.sendMulticastUrl + orderId , httpOptions);

  }

  pushFileToStorage(orderId:any ,imageName:any ,file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
 
    formdata.append('file', file);
 
    const req = new HttpRequest('POST',this.uploadPictureUrl +"/"+ orderId +"/"+imageName , formdata, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }
}
