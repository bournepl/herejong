import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { ResponseMessage } from '../model/response-message';
import { OrderDetail } from '../model/order-detail';
import { ResponseOrderId } from '../model/response-orderId';
import { Driver } from '../model/driver';
import { DriverUpdate } from '../model/driver-update';
import { UserProduct } from '../model/user-product';
import { UserProductGet } from '../model/user-produc-get';
import { FilterForm } from '../model/filter-form';
import { Product } from '../model/product';
import { UserProductUpdate } from '../model/user-product-update';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserProductService {

  private userProductUrl                 = 'https://api.herejong.com/user-service/api/user/product/create';
  private userProductGetUrl              = 'https://api.herejong.com/user-service/api/user/product/get';
  private userProductGetbyCategoryUrl    = 'https://api.herejong.com/user-service/api/user/product/get/byCategory';
  private userProductGetByIdUrl          = 'https://api.herejong.com/user-service/api/user/product/getById';
  private userProductDetalGetByIdUrl     = 'https://api.herejong.com/user-service/api/user/product/detail/getById';
  private userProductRomoveUrl           = 'https://api.herejong.com/user-service/api/user/product/remove';
  private userProductUpdateUrl           = 'https://api.herejong.com/user-service/api/user/product/update';
  private uploadPictureUrl               = 'https://api.herejong.com/user-service/api/user/product/upload/image';

  private getUserProductAllUrl           = 'https://api.herejong.com/user-service/api/user/product/get/all';
  private getUserProductOtherUrl         = 'https://api.herejong.com/user-service/api/user/product/get/other';

  private getUserProductFilterUrl        = 'https://api.herejong.com/user-service/api/user/product/get/filter';
  private getUserProductFilterAllUrl     = 'https://api.herejong.com/user-service/api/user/product/get/filter/all';

  constructor(private http: HttpClient) { }

  getUserProductFilterAll(filter : FilterForm): Observable<UserProductGet[]> {

   
    return this.http.post<UserProductGet[]>(this.getUserProductFilterAllUrl  , filter , { responseType: 'json' });

  }

  getUserProductFilter(filter : FilterForm): Observable<UserProductGet[]> {

   
    return this.http.post<UserProductGet[]>(this.getUserProductFilterUrl  , filter , { responseType: 'json' });

  } 

  getUserProductAll(): Observable<UserProductGet[]> {

    return this.http.get<UserProductGet[]>(this.getUserProductAllUrl , { responseType: 'json' });

  }

  getUserProductOther(): Observable<UserProduct> {

    return this.http.get<UserProduct>(this.getUserProductOtherUrl , { responseType: 'json' });

  }

  
  userProductCreate(userProduct: UserProduct): Observable<ResponseMessage> {

    return this.http.post<any>(this.userProductUrl , userProduct, httpOptions);

  }

  userProductGet(userId: String): Observable<UserProduct[]> {

    return this.http.get<UserProduct[]>(this.userProductGetUrl + '/' + userId, { responseType: 'json' });

  }

  userProductGetByCategory(userId: String, categoryId: String): Observable<UserProduct[]> {

    return this.http.get<UserProduct[]>(this.userProductGetbyCategoryUrl + '/' + userId + "/" + categoryId, { responseType: 'json' });

  }

  userProductGetById(id: String): Observable<UserProduct> {

    return this.http.get<UserProduct>(this.userProductGetByIdUrl + '/' + id, { responseType: 'json' });

  }

  userProductDetailGetById(id: String): Observable<UserProductGet[]> {

    return this.http.get<UserProductGet[]>(this.userProductDetalGetByIdUrl + '/' + id, { responseType: 'json' });

  }

  userProductReomve(userId ,id: String): Observable<any> {
    return this.http.delete(this.userProductRomoveUrl + '/' + userId + '/' + id , { responseType: 'json' });
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
