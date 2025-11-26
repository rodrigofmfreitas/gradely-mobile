import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  authState,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  user,
  AuthCredential
} from '@angular/fire/auth';

import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  authState: Observable<User | null> = authState(this.auth);
  isLoggedIn$: Observable<boolean>;

  constructor() {
    this.isLoggedIn$ = this.authState.pipe(map(user => !!user));
  }

  get currentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      user(this.auth).pipe(
        map(u => {
          resolve(u);
        })
      ).subscribe();
    });
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    return await signOut(this.auth);
  }

  async register(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle(): Promise<User | null> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
}



// import { Injectable } from '@angular/core';
// // import { AngularFireAuth } from '@angular/fire/compat/auth';
// // import firebase from 'firebase/compat/app';

// import { map, Observable } from 'rxjs';
// import {
//   Auth,
//   User,
//   UserCredential,
//   authState,
//   GoogleAuthProvider,
//   signInWithEmailAndPassword,
//   signOut,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   user,
//   AuthCredential
// } from '@angular/fire/auth';


// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   // 🔹 Expose an observable auth state
//   authState: Observable<firebase.User | null>;
//   isLoggedIn$: Observable<boolean>;

//   constructor(private afAuth: AngularFireAuth) {
//     this.authState = this.afAuth.authState;
//     this.isLoggedIn$ = this.authState.pipe(map(user => !!user));
//   }

//   // ✅ Promise that resolves to the current user (can be used with await if needed)
//   get currentUser(): Promise<firebase.User | null> {
//     return this.afAuth.currentUser;
//   }

//   // Example login (email & password)
//   async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
//     return await this.afAuth.signInWithEmailAndPassword(email, password);
//   }

//   // Example logout
//   async logout(): Promise<void> {
//     return await this.afAuth.signOut();
//   }

//   // Optional: create account
//   async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
//     return await this.afAuth.createUserWithEmailAndPassword(email, password);
//   }

//   async loginWithGoogle() {
//     try {
//       const provider = new firebase.auth.GoogleAuthProvider();
//       const result = await this.afAuth.signInWithPopup(provider);
//       return result.user;
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   }
// }
