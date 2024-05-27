import { Injectable, afterNextRender } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../shared/models/UserModel';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  Url = environment.URl;
  access_token = new BehaviorSubject<string | null>('');
  isUserLogin = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<UserModel | null | undefined>(undefined);
  UserAdvertisements: BehaviorSubject<AdvertisementsModel[]> =
    new BehaviorSubject<AdvertisementsModel[]>([]);
  UserFavoriteAdvertisements: BehaviorSubject<AdvertisementsModel[]> =
    new BehaviorSubject<AdvertisementsModel[]>([]);

  constructor(private router: Router, private httpClient: HttpClient) {
    this.access_token.subscribe((token) => {
      if (token) {
        this.isUserLogin.next(true);
        this.GetUserDatails();
        this.GetUsersAdvertisements();
        this.getUserFavoriteAdvertisements();
        console.log(this.user.getValue());
        console.log(this.UserFavoriteAdvertisements.getValue());
        console.log(this.UserAdvertisements.getValue());
      }
    });
    afterNextRender(() => {
      this.access_token.next(localStorage.getItem('access_token'));
    });
  }

  async register(email: string, password: string, confirmPassword: string) {
    alert('User registered successfully');
    const user = {
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
    };
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
        this.GetUsersAdvertisements();
        this.getUserFavoriteAdvertisements();
        // console.log(this.UserAdvertisements.getValue());
        console.log(this.UserFavoriteAdvertisements.getValue());
        console.log(this.UserAdvertisements.getValue());

        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed, please check your email and password.');
    }

    return false;
  }

  GetUserDatails() {
    this.httpClient
      .get<UserModel>(`${this.Url}api/Users/User`)
      .subscribe(async (response) => {
        if (response) {
          this.user.next(response);
        }
      });
  }

  GetUsersAdvertisements() {
    this.httpClient
      .get<AdvertisementsModel[]>(`${this.Url}api/Users/GetAdvertisements`)
      .subscribe((response) => {
        if (response) {
          this.UserAdvertisements.next(response);
        }
      });
  }

  getUserFavoriteAdvertisements() {
    this.httpClient
      .get<AdvertisementsModel[]>(`${this.Url}api/Users/GetFavorites`)
      .subscribe((response) => {
        if (response) {
          this.UserFavoriteAdvertisements.next(response);
        }
      });
  }
}
