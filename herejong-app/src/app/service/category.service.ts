import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../model/category';
import { Product } from '../model/product';
import { Group } from '../model/group';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private groupUrl          = 'https://api.herejong.com/customer-service/api/product/getGroup';
  private categoryUrl          = 'https://api.herejong.com/customer-service/api/product/getCategory/crane';
  private categoryByGroupUrl          = 'https://api.herejong.com/customer-service/api/product/getCategory/byGroup/';
  private categorySizeUrl      = 'https://api.herejong.com/customer-service/api/product/getProduct/byCategory/crane/';
  private categoryTruckUrl     = 'https://api.herejong.com/customer-service/api/product/getCategory/truck/';
  private categoryTruckSizeUrl = 'https://api.herejong.com/customer-service/api/product/getProduct/byCategory/truck/';
  private categorySizeAllUrl = 'https://api.herejong.com/customer-service/api/product/getProduct/byCategory/';
  private productIdUrl         ='https://api.herejong.com/customer-service/api/product/getProduct/byProductId/';

  private groupByIdUrl          = 'https://api.herejong.com/customer-service/api/product/getGroupById';
  private categoryByIdUrl       = 'https://api.herejong.com/customer-service/api/product/getCategoryById';
  
  constructor(private http: HttpClient) { }

  
  getProductByProductId(productId : number): Observable<Product> {

    return this.http.get<Product>(this.productIdUrl + productId , { responseType: 'json' });

  }


  getGroup(): Observable<Group> {

    return this.http.get<Group>(this.groupUrl , { responseType: 'json' });

  }

  getGroupById(id :any): Observable<Group> {

    return this.http.get<Group>(this.groupByIdUrl + "/" + id , { responseType: 'json' });

  }

  getCategoryById(id :any): Observable<Category> {

    return this.http.get<Category>(this.categoryByIdUrl + "/" + id , { responseType: 'json' });

  }

  getCategorySizeAll(categoryId : number): Observable<Product> {

    return this.http.get<Product>(this.categorySizeAllUrl + categoryId , { responseType: 'json' });

  }
  getCategory(): Observable<Category> {

    return this.http.get<Category>(this.categoryUrl , { responseType: 'json' });

  }
  getCategoryByGroup(groupId : number): Observable<Category> {

    return this.http.get<Category>(this.categoryByGroupUrl + groupId, { responseType: 'json' });

  }

  getCategorySize(categoryId : number): Observable<Product> {

    return this.http.get<Product>(this.categorySizeUrl + categoryId , { responseType: 'json' });

  }

  getCategoryTruck(): Observable<any> {

    return this.http.get<any>(this.categoryTruckUrl , { responseType: 'json' });

  }

  getCategoryTruckSize(categoryId : number): Observable<any> {

    return this.http.get<any>(this.categoryTruckSizeUrl + categoryId , { responseType: 'json' });

  }

}
