import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn() {
    debugger;
    if (sessionStorage.getItem('loggedInDetails')) {
      return true;
    }
    else {
      return false;
    }
  }
}
