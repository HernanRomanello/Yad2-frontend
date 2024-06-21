import { Injectable, afterNextRender } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, ReplaySubject, filter } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../shared/models/UserModel';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { LastsearchesModel } from '../../shared/models/LastsearchesModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  Url = environment.URl;
  access_token = new BehaviorSubject<string | null | undefined>('');
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
    afterNextRender(() => {
      this.access_token.next(localStorage.getItem('access_token'));
    });
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
        // console.log(this.UserFavoriteAdvertisements.getValue());
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

  async getUserFavoriteAdvertisements() {
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

  postNewAdvertisement(NewAdvertisement: any) {
    console.log('NewAdvertisement');
    // this.httpClient
    //   .post(`${this.Url}api/Users/CreateAdvertisement`, NewAdvertisement)
    //   .subscribe({
    //     next: (response) => {
    //       console.log('Advertisement created successfully', response);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       console.error('Error creating advertisement', error);
    //       if (error.status === 400) {
    //         console.error('Validation errors:', error.error.errors);
    //       }
    //     },
    //   });
    const formData = {
      city: NewAdvertisement.city,
      tradeType: NewAdvertisement.tradeType,
      street: NewAdvertisement.street,
      number: NewAdvertisement.number,
      floor: NewAdvertisement.floor,
      totalFloors: NewAdvertisement.totalFloors,
      onPillars: NewAdvertisement.onPillars,
      neighborhood: '   גני אביב',
      area: '  מרכז  ',
      assetType: 'דירה',
      assetState: 'משופצת',
      airDirections: 3,
      view: 'ים',
      rearProperty: false,
      rooms: '3.5',
      showerRooms: '1',
      privateParking: 1,
      hasPrivateParking: true,
      hasBolcony: true,
      hasImage: true,
      hasPrice: true,
      moshavOrKibutz: false,
      pirceDiscount: false,
      publisherIsMiddleMan: false,
      publisherIsContractor: false,
      balconiesNumber: 1,
      accessibleForDisabled: true,
      airConditioning: true,
      windowBars: true,
      solarWaterHeater: true,
      elevator: true,
      forRoommates: false,
      furnished: false,
      separateUnit: false,
      kosherKitchen: true,
      petsAllowed: true,
      renovated: true,
      safeRoom: true,
      multiLockDoors: true,
      airConditioner: true,
      tornadoAirConditioner: true,
      storageRoom: true,
      description: 'דירה משופצת ויפה במרכז תל אביב, קרובה לכל מה שצריך.',
      furnituredescription: 'ללא ריהוט',
      numberOfPayments: 12,
      houseCommitteePayment: 300,
      municipalityMonthlyPropertyTax: 600,
      builtSquareMeters: 100,
      gardenSquareMeters: 0,
      totalSquareMeters: 80,
      price: 3200,
      minimumAmount: 7000,
      pricePerMeter: 93.75,
      entryDate: 1656633600,
      immediate: false,
      flexible: true,
      longTerm: true,
      pictures: [
        'https://localhost:7211/uploads/10.jpeg',
        'https://localhost:7211/uploads/11.jpeg',
        'https://localhost:7211/uploads/12.jpeg',
      ],
      video: 'url_to_video',
      contactName: 'משה לוי',
      contactPhone: '052-1234567',
      standardizationAccepted: true,
    };
    console.log(formData);

    this.httpClient
      .post(`${this.Url}api/Users/CreateAdvertisement`, formData)
      .subscribe((data) => {
        this.UserAdvertisements.next([
          ...this.UserAdvertisements.value,
          data as AdvertisementsModel,
        ]);
      });
  }

  async updateAdvertisementToFavorites(advertisementId: number) {
    this.httpClient
      .post(`${this.Url}api/Users/user/updateFavorite/${advertisementId}`, null)
      .subscribe(() => {
        this.getUserFavoriteAdvertisements();
      });
  }
}
