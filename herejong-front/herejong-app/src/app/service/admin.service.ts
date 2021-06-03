import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { ResponseMessage } from '../model/response-message';
import { OrderDetail } from '../model/order-detail';
import { ResponseOrderId } from '../model/response-orderId';
import { Driver } from '../model/driver';
import { PointHistory } from '../model/point-history';
import { DriverUpdate } from '../model/driver-update';
import { CustomerProfile } from '../model/customer-profile';
import { UserProfile } from '../model/user-profile';
import { UserProfileMap } from '../model/user-profile-map';
import { UserProduct } from '../model/user-product';
import { UserProductUpdate } from '../model/user-product-update';
import { UserProfileUpdateAdmin } from '../model/user-profile-update-admin';
import { Point } from '../model/point';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private getCustomerUrl        = 'https://api.herejong.com/admin-service/api/customer/getCustomerProfile';
  private getUserUrl            = 'https://api.herejong.com/admin-service/api/user/getUserProfile';
  private getUserMapUrl            = 'https://api.herejong.com/admin-service/api/user/getUserProfile/map';
  private getUserByIdUrl        = 'https://api.herejong.com/admin-service/api/user/getUserProfileById';
  private getUserProductByIdUrl = 'https://api.herejong.com/admin-service/api/product/getUserProduct';

  private userProductGetByIdUrl          = 'https://api.herejong.com/admin-service/api/product/getById';
  private userProductRomoveUrl           = 'https://api.herejong.com/admin-service/api/product/remove';
  private userProductUrl                 = 'https://api.herejong.com/admin-service/api/product/create';
  private userProductUpdateUrl           = 'https://api.herejong.com/admin-service/api/product/update';
  private uploadPictureUrl               = 'https://api.herejong.com/admin-service/api/product/upload/image';

  private driverGetUrl                = 'https://api.herejong.com/admin-service/api/driver/getUserDriver';
  private driverGetByIdUrl            = 'https://api.herejong.com/admin-service/api/driver/getById';
  private driverUrl                   = 'https://api.herejong.com/admin-service/api/driver/create';
  private driverUpdateUrl             = 'https://api.herejong.com/admin-service/api/driver/update';
  private driverRomoveUrl             = 'https://api.herejong.com/admin-service/api/driver/remove';

  private updateUserUrl               = 'https://api.herejong.com/admin-service/api/user/update';
  private updateUserPointUrl          = 'https://api.herejong.com/admin-service/api/user/update/point';
  private romoveAllUrl                = 'https://api.herejong.com/admin-service/api/user/removeAll';


  private getPointHistoryUrl                = 'https://api.herejong.com/admin-service/api/point/getUserPoint';
  private updateUserPointHistoryUrl         = 'https://api.herejong.com/admin-service/api/point/update/point';

  constructor(private http: HttpClient) { }

  updateUserPointHistory(id :any): Observable<ResponseMessage> {

    return this.http.put<any>(this.updateUserPointHistoryUrl  + "/" + id, httpOptions);

  }

  pointGetByUserId(userId: String): Observable<PointHistory[]> {

    return this.http.get<PointHistory[]>(this.getPointHistoryUrl + '/' + userId, { responseType: 'json' });

  }

  romoveUserAll(userId: String): Observable<any> {
    return this.http.delete(this.romoveAllUrl + '/' + userId , { responseType: 'json' });
  }

   updateUserPoint(id :any, point : Point): Observable<ResponseMessage> {

    return this.http.put<any>(this.updateUserPointUrl  + "/" + id, point, httpOptions);

  }

  updateUser(id :any, userProfile : UserProfileUpdateAdmin): Observable<ResponseMessage> {

    return this.http.put<any>(this.updateUserUrl  + "/" + id, userProfile, httpOptions);

  }

    
  driverCreate(driver: Driver): Observable<ResponseMessage> {

    return this.http.post<any>(this.driverUrl , driver, httpOptions);

  }

  driverUpdate(id: String, driver: DriverUpdate): Observable<any> {
    return this.http.put<any>(this.driverUpdateUrl + '/' + id , driver,httpOptions);
  }


  driverGetById(id: String): Observable<Driver> {

    return this.http.get<Driver>(this.driverGetByIdUrl + '/' + id, { responseType: 'json' });

  }

  driverGet(userId: String): Observable<Driver[]> {

    return this.http.get<Driver[]>(this.driverGetUrl + '/' + userId, { responseType: 'json' });

  }

  driverReomve(id: String): Observable<any> {
    return this.http.delete(this.driverRomoveUrl + '/' + id , { responseType: 'json' });
  }

  getCustomerProfile(): Observable<CustomerProfile[]> {

    return this.http.get<any>(this.getCustomerUrl, { responseType: 'json' });

  }

  getUserProfile(): Observable<UserProfile[]> {

    return this.http.get<any>(this.getUserUrl, { responseType: 'json' });

  }
   getUserProfileMap(): Observable<UserProfileMap[]> {

    return this.http.get<any>(this.getUserMapUrl, { responseType: 'json' });

  }
  getUserProfileById(userId): Observable<UserProfile> {

    return this.http.get<any>(this.getUserByIdUrl + "/" + userId, { responseType: 'json' });

  }

  getUserProductById(userId): Observable<UserProduct[]> {

    return this.http.get<any>(this.getUserProductByIdUrl + "/" + userId, { responseType: 'json' });

  }

  
  userProductGetById(id: String): Observable<UserProduct> {

    return this.http.get<UserProduct>(this.userProductGetByIdUrl + '/' + id, { responseType: 'json' });

  }

  userProductReomve(userId ,id: String): Observable<any> {
    return this.http.delete(this.userProductRomoveUrl + '/' + userId + '/' + id , { responseType: 'json' });
  }

  userProductCreate(userProduct: UserProduct): Observable<ResponseMessage> {

    return this.http.post<any>(this.userProductUrl , userProduct, httpOptions);

  }

  userProductUpdate(id: String, userProduct: UserProductUpdate): Observable<any> {
    return this.http.put<any>(this.userProductUpdateUrl + '/' + id , userProduct,httpOptions);
  }

  pushFileToStorage(userId:any ,imageName:any ,file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
 
    formdata.append('file', file);
 
    const req = new HttpRequest('POST',this.uploadPictureUrl +"/"+ userId +"/"+imageName , formdata, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }


}
