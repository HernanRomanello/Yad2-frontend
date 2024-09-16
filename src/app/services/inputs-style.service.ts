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

  changeColor(textLength: number, massage: string): string {
    if (textLength > 0 && textLength < 8) {
      massage = 'מרגיש לנו שהטקסט שכתבת קצר מידי';
      console.log('red', textLength);

      return 'red';
    } else if (textLength > 7 && textLength < 32) {
      console.log('ff7100', textLength);

      massage = 'יופי, המודעה הולכת לכיוון הנכון';
      return '#ff7100';
    } else if (textLength >= 32 && textLength < 104) {
      console.log('fbaf02', textLength);

      massage = 'אוטוטו...';
      return '#fbaf02';
    } else if (textLength >= 104) {
      console.log('43c671', textLength);

      massage = 'בול!';
      return '#43c671';
    } else {
      console.log('363636', textLength);
      massage = 'הידעת: מודעה ללא תיאור, כמעט ולא מקבלת שיחות';
      return '#363636';
    }
  }

  changeWidth(textLength: number): string {
    if (textLength >= 100) {
      return '99.5%';
    }
    var groups = Math.floor(textLength / 4);
    var widthPercent = groups * 4;
    return widthPercent + '%';
  }

  changeRadius(textLength: number): string {
    if (textLength >= 103) {
      return '5px';
    }
    return '0px';
  }
}
