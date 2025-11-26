import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(firebaseUser => {
      const isLoggedIn = !!firebaseUser;

      if (isLoggedIn) {
        return router.createUrlTree(['/profile']);
      } else {
        return true;
      }
    })
  );
};
