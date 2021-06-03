import { Injectable } from '@angular/core';
import { OfferPrice } from '../model/offer-price';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Province } from '../model/province';
import { UserProfile } from '../model/user-profile';
import { ResponseMessage } from '../model/response-message';
import { UserProfileUpdate } from '../model/user-profile-update';
import { ResponsePointId } from '../model/response-pointId';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {


  private registerUserUrl   = 'https://api.herejong.com/user-service/api/user/register';
  private registerSuccessUrl   = 'https://api.herejong.com/user-service/api/user/register/success/';
  private offerPriceUrl   = 'https://api.herejong.com/user-service/api/user/offer/price';
  private updateUserUrl   = 'https://api.herejong.com/user-service/api/user/update';
  private getUserUrl   = 'https://api.herejong.com/user-service/api/user/get';

  private pointUrl   = 'https://api.herejong.com/user-service/api/user/point/create';
  private pointSendUrl   = 'https://api.herejong.com/user-service/api/user/point/checkout';
  constructor(private http: HttpClient) { }

  sendPoint(userId:string ,pointId : string): Observable<ResponseMessage> {

    return this.http.post<any>(this.pointSendUrl + "/" + userId + "/" +pointId, httpOptions);

  }


  pointCreate(userId:string ,pointForm : any): Observable<ResponsePointId> {

    return this.http.post<any>(this.pointUrl + "/" + userId , pointForm, httpOptions);

  }

  updateUser(id :any, userProfile : UserProfileUpdate): Observable<ResponseMessage> {

    return this.http.put<any>(this.updateUserUrl  + "/" + id, userProfile, httpOptions);

  }

  getUser(userId: String): Observable<UserProfile> {

    return this.http.get<UserProfile>(this.getUserUrl + '/' + userId, { responseType: 'json' });

  }



  registerUser(userProfile : UserProfile): Observable<ResponseMessage> {

    return this.http.post<any>(this.registerUserUrl , userProfile, httpOptions);

  }

  registerSuccess(userId : string): Observable<ResponseMessage> {

    return this.http.post<any>(this.registerSuccessUrl + userId , httpOptions);

  }

  offerPrice(offerPrice : OfferPrice): Observable<ResponseMessage> {

    return this.http.post<any>(this.offerPriceUrl , offerPrice, httpOptions);

  }

  offerPriceSend(offerPrice : OfferPrice): Observable<ResponseMessage> {

    return this.http.post<any>(this.offerPriceUrl + "/send", offerPrice, httpOptions);

  }
}
