import { Injectable, OnInit, afterNextRender } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, ReplaySubject, filter } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../shared/models/UserModel';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { LastsearchesModel } from '../../shared/models/LastsearchesModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
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
  IsMainHeaderISOpen = new BehaviorSubject<boolean>(true);
  IsMainFooterISOpen = new BehaviorSubject<boolean>(true);
  IsalternativeHeaderISOpen = new BehaviorSubject<boolean>(false);
  IsUserAreaISOpen = new BehaviorSubject<boolean>(false);
  UserPageRender = new BehaviorSubject<string>('');
  userName = new BehaviorSubject<string>('');
  firstLetterUserEmailAddress = new BehaviorSubject<string>('');
  userName1 = new ReplaySubject<string>(1);
  firstLetterUserEmailAddress1 = new ReplaySubject<string>(1);

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
  ngOnInit(): void {
    this.GetUserDatails();
  }

  async SetPageRender(page: string) {
    this.UserPageRender.next(page);
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> {
    const user = {
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
    };

    try {
      const response = await this.httpClient
        .post<any>(`${this.Url}api/Users/signup`, user)
        .toPromise();

      if (response) {
        const success = await this.login(email, password);
        if (success) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  isUserAreaOpen(isOpen: boolean) {
    this.IsUserAreaISOpen.next(isOpen);
  }

  IsHeaderAndFooterOpen(IsHeaderhide: boolean, IsFooterhide: boolean) {
    this.IsMainHeaderISOpen.next(IsHeaderhide);
    this.IsMainFooterISOpen.next(IsFooterhide);
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
        this.router.navigate(['/']);

        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }

    return false;
  }

  async logout() {
    this.isUserLogin.next(false);
    this.access_token.next(undefined);
    localStorage.setItem('access_token', '');
    this.router.navigate(['/login']);
  }

  GetUserDatails() {
    this.httpClient
      .get<UserModel>(`${this.Url}api/Users/User`)
      .subscribe(async (response) => {
        if (response) {
          this.user.next(response);
          this.saveUserDetails(response.name, response.email);
        }
      });
  }

  private saveUserDetails(name: string, email: string) {
    if (!name || !email) {
      return;
    }
    this.userName1.next(name.valueOf());
    this.firstLetterUserEmailAddress1.next(email[0].valueOf().toUpperCase());
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
    const date = new Date(NewAdvertisement.entryDate);
    const milliseconds = date.getTime();
    const minAmount = NewAdvertisement.tradeType === 'השכרה' ? 100 : 10000;

    const formData = {
      city: NewAdvertisement.city,
      tradeType: NewAdvertisement.tradeType,
      street: NewAdvertisement.street,
      number: NewAdvertisement.number,
      floor: NewAdvertisement.floor,
      totalFloors: NewAdvertisement.totalFloors,
      onPillars: NewAdvertisement.onPillars,
      neighborhood: NewAdvertisement.neighborhood,
      area: NewAdvertisement.area,
      assetType: NewAdvertisement.assetType,
      assetState: NewAdvertisement.assetState,
      airDirections: NewAdvertisement.airDirections,
      view: NewAdvertisement.view,
      rearProperty: NewAdvertisement.rearProperty,
      rooms: NewAdvertisement.rooms,
      showerRooms: NewAdvertisement.showerRooms,
      privateParking: NewAdvertisement.privateParking,
      hasPrivateParking: NewAdvertisement.hasPrivateParking,
      hasBolcony: NewAdvertisement.hasBolcony,
      hasImage: NewAdvertisement.hasImage,
      hasPrice: NewAdvertisement.hasPrice,
      moshavOrKibutz: false,
      pirceDiscount: false,
      publisherIsMiddleMan: false,
      publisherIsContractor: false,
      balconiesNumber: NewAdvertisement.balconiesNumber,
      accessibleForDisabled: NewAdvertisement.accessibleForDisabled,
      airConditioning: NewAdvertisement.airConditioning,
      windowBars: NewAdvertisement.windowBars,
      solarWaterHeater: NewAdvertisement.solarWaterHeater,
      elevator: NewAdvertisement.elevator,
      forRoommates: NewAdvertisement.forRoommates,
      furnished: NewAdvertisement.furnished,
      separateUnit: NewAdvertisement.separateUnit,
      kosherKitchen: NewAdvertisement.kosherKitchen,
      petsAllowed: NewAdvertisement.petsAllowed,
      renovated: NewAdvertisement.renovated,
      safeRoom: NewAdvertisement.safeRoom,
      multiLockDoors: NewAdvertisement.multiLockDoors,
      airConditioner: false,
      tornadoAirConditioner: NewAdvertisement.tornadoAirConditioner,
      storageRoom: NewAdvertisement.storageRoom,
      description: NewAdvertisement.description,
      furnituredescription: NewAdvertisement.furnituredescription,
      numberOfPayments: NewAdvertisement.numberOfPayments,
      houseCommitteePayment: NewAdvertisement.houseCommitteePayment,
      municipalityMonthlyPropertyTax:
        NewAdvertisement.municipalityMonthlyPropertyTax,
      builtSquareMeters: NewAdvertisement.builtSquareMeters,
      gardenSquareMeters: NewAdvertisement.gardenSquareMeters,
      totalSquareMeters: NewAdvertisement.totalSquareMeters,
      price: NewAdvertisement.price,
      minimumAmount: '100',
      pricePerMeter: NewAdvertisement.pricePerMeter,
      entryDate: milliseconds,
      immediate: NewAdvertisement.immediate,
      flexible: NewAdvertisement.flexible,
      longTerm: NewAdvertisement.longTerm,

      pictures: NewAdvertisement.pictures,
      video: 'url_to_video',
      contactName: NewAdvertisement.contactName,
      contactPhone: NewAdvertisement.contactPhone,
      standardizationAccepted: NewAdvertisement.standardizationAccepted,
    };

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
