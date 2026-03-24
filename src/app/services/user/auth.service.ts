import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserModel } from '../../shared/models/UserModel';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { LastsearchesModel } from '../../shared/models/LastsearchesModel';
import { UserNoteModel } from '../../shared/models/UserNoteModel';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  Url = environment.apiUrl;

  isUserLogin = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<UserModel | null>(null);
  UserAdvertisements = new BehaviorSubject<AdvertisementsModel[]>([]);
  UserFavoriteAdvertisements = new BehaviorSubject<AdvertisementsModel[]>([]);
  userLastSearches = new BehaviorSubject<LastsearchesModel[]>([]);
  UserAdvertisementsStatistics =
    new BehaviorSubject<AdvertisementsModel | null>(null);
  userName = new BehaviorSubject<string>('');
  firstLetterUserEmailAddress = new BehaviorSubject<string>('');
  userNotes = new BehaviorSubject<UserNoteModel[]>([]);

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuth();
    }
  }

  private checkAuth() {
    this.httpClient
      .get<UserModel>(`${this.Url}api/Users/User`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.isUserLogin.next(true);
            this.user.next(response);
            this.saveUserDetails(response.name, response.email);
            this.loadUserData(false);
          }
        },
        error: (err) => {
          if (err.status === 401) {
            this.clearUserState();
            return;
          }

          console.error(err);
        },
      });
  }

  private loadUserData(includeUserDetails: boolean = true) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (includeUserDetails) {
      this.GetUserDatails();
    }

    this.GetUsersAdvertisements();
    this.getUserFavoriteAdvertisements();
    this.getUserLastSearches();
    this.getUserAdvertisementsStatistics();
    this.getUserNotes();
  }

  private clearUserState() {
    this.isUserLogin.next(false);
    this.user.next(null);
    this.UserAdvertisements.next([]);
    this.UserFavoriteAdvertisements.next([]);
    this.userLastSearches.next([]);
    this.UserAdvertisementsStatistics.next(null);
    this.userName.next('');
    this.firstLetterUserEmailAddress.next('');
    this.userNotes.next([]);
  }

  private handleAuthError(err: any) {
    if (err?.status === 401) {
      this.clearUserState();
      return;
    }

    console.error(err);
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<boolean> {
    const user = {
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
    };

    try {
      const response = await firstValueFrom(
        this.httpClient.post<any>(`${this.Url}api/Users/signup`, user, {
          withCredentials: true,
        }),
      );

      if (response) {
        return await this.login(email, password);
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const body = { email, password };

    try {
      await firstValueFrom(
        this.httpClient.post(`${this.Url}api/Users/login`, body, {
          responseType: 'text' as 'json',
          withCredentials: true,
        }),
      );

      this.isUserLogin.next(true);
      this.loadUserData();

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      this.clearUserState();
      return false;
    }
  }

  async logout() {
    try {
      await firstValueFrom(
        this.httpClient.post(
          `${this.Url}api/Users/logout`,
          {},
          {
            withCredentials: true,
          },
        ),
      );
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearUserState();
      this.router.navigate(['/login']);
    }
  }

  GetUserDatails() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.httpClient
      .get<UserModel>(`${this.Url}api/Users/User`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.user.next(response);
            this.saveUserDetails(response.name, response.email);
          }
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  private saveUserDetails(name: string, email: string) {
    if (!name || !email) {
      return;
    }

    this.userName.next(name);
    this.firstLetterUserEmailAddress.next(email[0].toUpperCase());
  }

  GetUsersAdvertisements() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.httpClient
      .get<AdvertisementsModel[]>(`${this.Url}api/Users/GetAdvertisements`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.UserAdvertisements.next(response.sort((a, b) => b.id - a.id));
          }
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  getUserFavoriteAdvertisements() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.httpClient
      .get<AdvertisementsModel[]>(`${this.Url}api/Users/GetFavorites`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.UserFavoriteAdvertisements.next(response);
          }
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  getUserLastSearches() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.httpClient
      .get<LastsearchesModel[]>(`${this.Url}api/Users/user/GetLastSearches`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.userLastSearches.next(response);
          }
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  getUserAdvertisementsStatistics() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.httpClient
      .get<AdvertisementsModel>(`${this.Url}api/Users/User/UserStatistics`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.UserAdvertisementsStatistics.next(response);
          }
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  getUserNotes() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.httpClient
      .get<UserNoteModel[]>(`${this.Url}api/Users/user/GetNotes`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.userNotes.next(response);
          }
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  postAdNoteToUser(advertisementId: number, note: string) {
    const newNote = { adID: advertisementId, note: note };

    this.httpClient
      .post(`${this.Url}api/Users/user/addNote/${advertisementId}`, newNote, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.getUserNotes();
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  validateNumberString(input: string): number | null {
    if (!input || input === '') {
      return 0;
    }

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char < '0' || char > '9') {
        return 0;
      }
    }

    return parseInt(input, 10) || 0;
  }

  postNewAdvertisement(NewAdvertisement: any) {
    const date = new Date(NewAdvertisement.entryDate);
    const milliseconds = date.getTime();

    NewAdvertisement.number = this.validateNumberString(
      NewAdvertisement.number,
    );
    NewAdvertisement.floor = this.validateNumberString(NewAdvertisement.floor);
    NewAdvertisement.totalFloors = this.validateNumberString(
      NewAdvertisement.totalFloors,
    );
    NewAdvertisement.airDirections = this.validateNumberString(
      NewAdvertisement.airDirections,
    );
    NewAdvertisement.rooms = this.validateNumberString(NewAdvertisement.rooms);
    NewAdvertisement.showerRooms = this.validateNumberString(
      NewAdvertisement.showerRooms,
    );
    NewAdvertisement.privateParking = this.validateNumberString(
      NewAdvertisement.privateParking,
    );
    NewAdvertisement.balconiesNumber = this.validateNumberString(
      NewAdvertisement.balconiesNumber,
    );
    NewAdvertisement.numberOfPayments = this.validateNumberString(
      NewAdvertisement.numberOfPayments,
    );
    NewAdvertisement.builtSquareMeters = this.validateNumberString(
      NewAdvertisement.builtSquareMeters,
    );
    NewAdvertisement.gardenSquareMeters = this.validateNumberString(
      NewAdvertisement.builtSquareMeters,
    );
    NewAdvertisement.minimumAmount = this.validateNumberString(
      NewAdvertisement.minimumAmount,
    );
    NewAdvertisement.minimumAmount = this.validateNumberString(
      NewAdvertisement.minimumAmount,
    );
    NewAdvertisement.builtSqpricePerMeteruareMeters = this.validateNumberString(
      NewAdvertisement.builtSqpricePerMeteruareMeters,
    );
    NewAdvertisement.price = this.validateNumberString(NewAdvertisement.price);
    NewAdvertisement.totalSquareMeters = this.validateNumberString(
      NewAdvertisement.totalSquareMeters,
    );

    const formData = {
      city: NewAdvertisement.city ?? '',
      tradeType: NewAdvertisement.tradeType ?? '',
      street: NewAdvertisement.street ?? '',
      number: NewAdvertisement.number ?? 0,
      floor: NewAdvertisement.floor ?? 0,
      totalFloors: NewAdvertisement.totalFloors ?? 0,
      onPillars: NewAdvertisement.onPillars ?? false,
      neighborhood: NewAdvertisement.neighborhood ?? '',
      area: NewAdvertisement.area ?? '',
      assetType: NewAdvertisement.assetType ?? '',
      assetState: NewAdvertisement.assetState ?? '',
      airDirections: NewAdvertisement.airDirections ?? 0,
      view: NewAdvertisement.view ?? '',
      rearProperty: NewAdvertisement.rearProperty ?? '',
      rooms: NewAdvertisement.rooms ?? 0,
      showerRooms: NewAdvertisement.showerRooms ?? 0,
      privateParking: NewAdvertisement.privateParking ?? 0,
      hasPrivateParking: NewAdvertisement.hasPrivateParking ?? false,
      hasBolcony: NewAdvertisement.hasBolcony ?? false,
      hasImage: NewAdvertisement.hasImage,
      hasPrice: NewAdvertisement.hasPrice,
      moshavOrKibutz: false,
      pirceDiscount: false,
      publisherIsMiddleMan: false,
      publisherIsContractor: false,
      balconiesNumber: NewAdvertisement.balconiesNumber ?? 0,
      accessibleForDisabled: NewAdvertisement.accessibleForDisabled ?? false,
      airConditioning: NewAdvertisement.airConditioning ?? false,
      windowBars: NewAdvertisement.windowBars ?? false,
      solarWaterHeater: NewAdvertisement.solarWaterHeater ?? false,
      elevator: NewAdvertisement.elevator ?? false,
      forRoommates: NewAdvertisement.forRoommates ?? false,
      furnished: NewAdvertisement.furnished ?? false,
      separateUnit: NewAdvertisement.separateUnit ?? false,
      kosherKitchen: NewAdvertisement.kosherKitchen ?? false,
      petsAllowed: NewAdvertisement.petsAllowed ?? false,
      renovated: NewAdvertisement.renovated ?? false,
      safeRoom: NewAdvertisement.safeRoom ?? false,
      multiLockDoors: NewAdvertisement.multiLockDoors ?? false,
      airConditioner: NewAdvertisement.airConditioner ?? false,
      tornadoAirConditioner: NewAdvertisement.tornadoAirConditioner ?? false,
      storageRoom: NewAdvertisement.storageRoom ?? false,
      description: NewAdvertisement.description ?? '',
      furnituredescription: NewAdvertisement.furnituredescription ?? '',
      numberOfPayments: NewAdvertisement.numberOfPayments ?? 0,
      houseCommitteePayment: NewAdvertisement.houseCommitteePayment ?? 0,
      municipalityMonthlyPropertyTax:
        NewAdvertisement.municipalityMonthlyPropertyTax ?? 0,
      builtSquareMeters: NewAdvertisement.builtSquareMeters ?? 0,
      gardenSquareMeters: NewAdvertisement.gardenSquareMeters ?? 0,
      totalSquareMeters: NewAdvertisement.totalSquareMeters ?? 0,
      price: NewAdvertisement.price ?? 0,
      minimumAmount: NewAdvertisement.minimumAmount ?? 0,
      pricePerMeter: NewAdvertisement.builtSqpricePerMeteruareMeters ?? 0,
      entryDate: milliseconds ?? 0,
      immediate: NewAdvertisement.immediate ?? false,
      flexible: NewAdvertisement.flexible ?? false,
      longTerm: NewAdvertisement.longTerm ?? false,
      pictures: NewAdvertisement.pictures ?? [],
      MainPicture: NewAdvertisement.pictures[0] ?? '',
      video: NewAdvertisement.video ?? '',
      contactName: NewAdvertisement.contactName ?? '',
      SecondContactName: NewAdvertisement.secondContactName ?? '',
      contactPhone: NewAdvertisement.contactPhone ?? '',
      SecondContactPhone: NewAdvertisement.secondContactName ?? '',
      standardizationAccepted:
        NewAdvertisement.standardizationAccepted ?? false,
    };

    this.httpClient
      .post<HttpResponse<any>>(
        `${this.Url}api/Users/CreateAdvertisement`,
        formData,
        {
          observe: 'response',
          withCredentials: true,
        },
      )
      .pipe(
        map((response) => {
          if (response.status === 200 || response.status === 204) {
            this.router.navigate(['/confirmation-modal']);
          }
          return response;
        }),
      )
      .subscribe({
        next: () => {
          this.GetUsersAdvertisements();
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  deleteAdvertisement(advertisementId: number) {
    this.httpClient
      .delete(`${this.Url}api/Users/DeleteAdvertisement/${advertisementId}`, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.GetUsersAdvertisements();
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  updateAdvertisementToFavorites(advertisementId: number) {
    this.httpClient
      .post(
        `${this.Url}api/Users/user/updateFavorite/${advertisementId}`,
        null,
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: () => {
          this.getUserFavoriteAdvertisements();
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  updateUserDetails(user: UserModel) {
    this.httpClient
      .put(`${this.Url}api/Users/user/update`, user, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.GetUserDatails();
        },
        error: (err) => this.handleAuthError(err),
      });
  }
}
