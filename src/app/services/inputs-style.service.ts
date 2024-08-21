import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InputsStyleService {
  constructor() {}
  switchPasswordVisibility(isPasswordHidden: boolean): string {
    return isPasswordHidden
      ? 'assets/images/password-exposed.svg'
      : 'assets/images/password-invisible.svg';
  }
}
