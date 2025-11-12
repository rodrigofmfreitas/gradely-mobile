import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 🔹 Expose an observable auth state
  authState: Observable<firebase.User | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth) {
    this.authState = this.afAuth.authState;
    this.isLoggedIn$ = this.authState.pipe(map(user => !!user));
  }

  // ✅ Promise that resolves to the current user (can be used with await if needed)
  get currentUser(): Promise<firebase.User | null> {
    return this.afAuth.currentUser;
  }

  // Example login (email & password)
  async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Example logout
  async logout(): Promise<void> {
    return await this.afAuth.signOut();
  }

  // Optional: create account
  async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
}



// import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import firebase from 'firebase/compat/app';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private loggedIn = new BehaviorSubject<boolean>(false);
//   isLoggedIn$ = this.loggedIn.asObservable();

//   currentUser: firebase.User | null = null;

//   constructor(private afAuth: AngularFireAuth) {
//     this.afAuth.authState.subscribe((user) => {
//       this.currentUser = user;
//       this.loggedIn.next(!!user);
//     });
//   }

//   async login(email: string, password: string): Promise<boolean> {
//     try {
//       await this.afAuth.signInWithEmailAndPassword(email, password);
//       return true;
//     } catch (error) {
//       console.error('Login error:', error);
//       return false;
//     }
//   }

//   async loginWithGoogle(): Promise<boolean> {
//     try {
//       const provider = new firebase.auth.GoogleAuthProvider();
//       await this.afAuth.signInWithPopup(provider);
//       return true;
//     } catch (error) {
//       console.error('Google login error:', error);
//       return false;
//     }
//   }

//   async logout(): Promise<void> {
//     await this.afAuth.signOut();
//   }

//   async getCurrentUser(): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.afAuth.onAuthStateChanged(
//         (user) => {
//           resolve(user);
//         },
//         (error) => reject(error)
//       );
//     });
//   }
// }
