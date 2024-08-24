import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InputsStyleService {
  constructor(private router: Router, private authServise: AuthService) {}
  switchPasswordVisibility(isPasswordHidden: boolean): string {
    return isPasswordHidden
      ? 'assets/images/password-exposed.svg'
      : 'assets/images/password-invisible.svg';
  }

  reloloadPage(): void {
    setInterval(() => {
      window.location.reload();
    }, 100);
    scrollTo(0, 0);
  }

  navigateTomainPage(): void {
    this.authServise.IsHeaderAndFooterOpen(true, true);
    this.router.navigate(['/']);
    this.reloloadPage();
  }

  changeBorderColor(consitions: any, Class: string): string {
    const className = Class;
    const borderClass = consitions ? 'red-border' : 'gray-border';
    return className + ' ' + borderClass;
  }
}
