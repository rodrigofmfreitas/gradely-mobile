import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  login(username: string, password: string): boolean {
    // ✅ Fake login just for now
    if (username === 'admin' && password === '1234') {
      this.loggedIn.next(true);
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn.next(false);
  }
}
