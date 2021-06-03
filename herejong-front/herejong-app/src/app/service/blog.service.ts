import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { ResponseMessage } from '../model/response-message';
import { OrderDetail } from '../model/order-detail';
import { ResponseOrderId } from '../model/response-orderId';
import { Driver } from '../model/driver';
import { DriverUpdate } from '../model/driver-update';
import { Blog } from '../model/blog';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogUrl                 = 'https://api.herejong.com/admin-service/api/blog/create';
  private blogGetUrl              = 'https://api.herejong.com/admin-service/api/blog/get/all';
  private blogGetByIdUrl          = 'https://api.herejong.com/admin-service/api/blog/getById';
  private blogRomoveUrl           = 'https://api.herejong.com/admin-service/api/blog/remove';
  private blogUpdateUrl           = 'https://api.herejong.com/admin-service/api/blog/update';
 
  private uploadPictureUrl        = 'https://api.herejong.com/admin-service/api/blog/upload/image';


  private blogGetUrlcustomer              = 'https://api.herejong.com/customer-service/api/blog/get/all';
  private blogGetUrlcustomerHome              = 'https://api.herejong.com/customer-service/api/blog/get/home';
  private blogGetByIdUrlcustomer          = 'https://api.herejong.com/customer-service/api/blog/getById';

  constructor(private http: HttpClient) { }

  
  blogCreate(blog: Blog): Observable<ResponseMessage> {

    return this.http.post<any>(this.blogUrl , blog, httpOptions);

  }

  blogGet(): Observable<Blog[]> {

    return this.http.get<Blog[]>(this.blogGetUrl, { responseType: 'json' });

  }

  blogGetById(id: String): Observable<Blog> {

    return this.http.get<Blog>(this.blogGetByIdUrl + '/' + id, { responseType: 'json' });

  }

  blogReomve(id: String): Observable<any> {
    return this.http.delete(this.blogRomoveUrl + '/' + id , { responseType: 'json' });
  }

  blogUpdate(id: String, blog: Blog): Observable<any> {
    return this.http.put<any>(this.blogUpdateUrl + '/' + id , blog,httpOptions);
  }

  pushFileToStorage(imageName:any ,file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
 
    formdata.append('file', file);
 
    const req = new HttpRequest('POST',this.uploadPictureUrl +"/"+imageName , formdata, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }




  blogGetHome(): Observable<Blog[]> {

    return this.http.get<Blog[]>(this.blogGetUrlcustomerHome, { responseType: 'json' });

  }
  blogGetAllHome(): Observable<Blog[]> {

    return this.http.get<Blog[]>(this.blogGetUrlcustomer, { responseType: 'json' });

  }
  blogGetByIdHome(id: String): Observable<Blog> {

    return this.http.get<Blog>(this.blogGetByIdUrlcustomer + '/' + id, { responseType: 'json' });

  }



}
