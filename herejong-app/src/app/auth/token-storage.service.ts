import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private roles: Array<string> = [];
  constructor() { }

  signOut() {

    sessionStorage.clear();


  }

  public saveToken(token: string) {

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);


  }

  public getToken(): string {

    return sessionStorage.getItem(TOKEN_KEY);


  }

  public saveUsername(username: string) {

    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.setItem(USERNAME_KEY, username);


  }

  public saveId(id: string) {

    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.setItem(USERNAME_KEY, id);


  }

  public getUsername(): string {

    return sessionStorage.getItem(USERNAME_KEY);


  }

  public saveAuthorities(authorities: string[]) {

    sessionStorage.removeItem(AUTHORITIES_KEY);
    sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));


  }

  public getAuthorities(): string[] {

    this.roles = [];

    if (sessionStorage.getItem(TOKEN_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority.authority);
      });
      return this.roles;
    }

  }
}
