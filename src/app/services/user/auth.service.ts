import { Injectable, afterNextRender } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  Url = environment.URl;
  access_token = new BehaviorSubject<string | null>('');
  isUserLogin = new BehaviorSubject<boolean>(false);
  constructor(private router: Router, private httpClient: HttpClient) {
    this.access_token.subscribe((token) => {
      if (token) {
        this.isUserLogin.next(true);
        // this.GetUserDatails();
      }
    });
    afterNextRender(() => {
      this.access_token.next(localStorage.getItem('access_token'));
    });
  }

  async register(user: any, email: string, password: string) {
    this.httpClient
      .post<any>(`${this.Url}api/Users/signup`, user)
      .subscribe(async (response) => {
        if (response) {
          await this.login(email, password);
          this.router.navigate(['/']);
        }
      });
  }

  async login(email: string, password: string): Promise<boolean> {
    const body = { email, password };
    try {
      const accessToken = await this.httpClient
        .post<string>(`${this.Url}api/Users/login`, body, {
          responseType: 'text' as 'json',
        })
        .toPromise();

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        this.access_token.next(accessToken);
        // this.isUserLogin.next(true);
        // this.GetUserDatails();
        // this.userEmail.next(email);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed, please check your email and password.');
    }

    return false;
  }
}
