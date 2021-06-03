import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

import { JwtResponse } from './jwt-response';
import { AuthLoginInfo } from './login-info';
import { SignUpInfo } from './signup-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
 

export class AuthService {

  private loginUrl    = 'https://api.herejong.com/admin-service/api/auth/signin';
  private registerUrl = 'https://api.herejong.com/admin-service/api/auth/signup';


  constructor(private http: HttpClient) {
  }

  login(loginForm: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, loginForm, httpOptions);
  }

  register(signUpForm: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.registerUrl, signUpForm, httpOptions);
  }



}
