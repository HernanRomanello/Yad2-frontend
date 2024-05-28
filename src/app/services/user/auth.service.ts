import { Injectable, afterNextRender } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, ReplaySubject, filter, first } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../shared/models/UserModel';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { LastsearchesModel } from '../../shared/models/LastsearchesModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  Url = environment.URl;
  access_token = new BehaviorSubject<string | null | undefined>(
    localStorage.getItem('access_token')
  );
  isUserLogin = new ReplaySubject<boolean>(1);
  user = new BehaviorSubject<UserModel | null | undefined>(undefined);
  UserAdvertisements: BehaviorSubject<AdvertisementsModel[]> =
    new BehaviorSubject<AdvertisementsModel[]>([]);
  UserFavoriteAdvertisements: BehaviorSubject<AdvertisementsModel[]> =
    new BehaviorSubject<AdvertisementsModel[]>([]);
  userLastSearches: BehaviorSubject<LastsearchesModel[]> = new BehaviorSubject<
    LastsearchesModel[]
  >([]);
  UserAdvertisementsStatistics =
    new BehaviorSubject<AdvertisementsModel | null>(null);

  constructor(private router: Router, private httpClient: HttpClient) {
    this.access_token
      .pipe(filter((it) => it !== undefined))
      .subscribe((token) => {
        if (token) {
          this.isUserLogin.next(true);
          this.GetUserDatails();
          this.GetUsersAdvertisements();
          this.getUserFavoriteAdvertisements();
          this.getUserLastSearches();
          this.getUserAdvertisementsStatistics();
          // console.log(this.user.getValue());
          // console.log(this.UserFavoriteAdvertisements.getValue());
          // console.log(this.UserAdvertisements.getValue());
        } else {
          this.isUserLogin.next(false);
        }
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
        console.log(this.UserFavoriteAdvertisements.getValue());
        // console.log(this.UserAdvertisements.getValue());
        // console.log(this.user.getValue());
        // console.log(this.userLastSearches.getValue());
        // console.log(this.UserAdvertisementsStatistics.getValue());

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

  getUserLastSearches() {
    this.httpClient
      .get<LastsearchesModel[]>(`${this.Url}api/Users/user/GetLastSearches`)
      .subscribe((response) => {
        if (response) {
          this.userLastSearches.next(response);
        }
      });
  }

  getUserAdvertisementsStatistics() {
    this.httpClient
      .get<AdvertisementsModel>(`${this.Url}api/Users/User/UserStatistics`)
      .subscribe((response) => {
        if (response) {
          this.UserAdvertisementsStatistics.next(response);
        }
      });
  }
}
