import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  async login(email: string, password: string): Promise<boolean> {
    // const isAdmin = this.isUserIsAdmin.value;
    // const body = { email, password, isAdmin };
    // try {
    //   const accessToken = await this.httpClient
    //     .post<string>(`${this.Url}api/Users/login`, body, {
    //       responseType: 'text' as 'json',
    //     })
    //     .toPromise();

    //   if (accessToken) {
    //     localStorage.setItem('access_token', accessToken);
    //     this.access_token.next(accessToken);
    //     this.isUserLogin.next(true);
    //     this.GetUserDatails();
    //     this.userEmail.next(email);
    //     return true;
    //   }
    // } catch (error) {
    //   console.error('Login failed:', error);
    //   alert('Login failed, please check your email and password.');
    // }

    return false;
  }
}
