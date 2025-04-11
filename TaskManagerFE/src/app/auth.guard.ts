import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (sessionStorage.getItem('userToken')) {
    return true;
  }
  console.log('here2')
  return false;
};
