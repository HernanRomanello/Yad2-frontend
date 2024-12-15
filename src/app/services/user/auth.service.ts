import { Injectable, OnInit, afterNextRender } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, ReplaySubject, filter, map } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserModel } from '../../shared/models/UserModel';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { LastsearchesModel } from '../../shared/models/LastsearchesModel';
import { UserNoteModel } from '../../shared/models/UserNoteModel';
import { AdvertisementService } from '../advertisement.service';

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
  UserPageRender = new BehaviorSubject<string>('');
  userName = new ReplaySubject<string>(1);
  firstLetterUserEmailAddress = new ReplaySubject<string>(1);
  userNotes = new BehaviorSubject<UserNoteModel[]>([]);

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

  postAdNoteToUser(advertisementId: number, note: string) {
    const newNote = { adID: advertisementId, note: note };
    this.httpClient
      .post(`${this.Url}api/Users/user/addNote/${advertisementId}`, newNote)
      .subscribe(() => {
        this.getUserFavoriteAdvertisements();
      });
  }

  getUserNotes() {
    this.httpClient
      .get<UserNoteModel[]>(`${this.Url}api/Users/user/GetNotes`)
      .subscribe((response) => {
        if (response) {
          this.userNotes.next(response);
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
    this.userName.next(name.valueOf());
    this.firstLetterUserEmailAddress.next(email[0].valueOf().toUpperCase());
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
      NewAdvertisement.number
    );
    NewAdvertisement.floor = this.validateNumberString(NewAdvertisement.floor);
    NewAdvertisement.totalFloors = this.validateNumberString(
      NewAdvertisement.totalFloors
    );
    NewAdvertisement.airDirections = this.validateNumberString(
      NewAdvertisement.airDirections
    );
    NewAdvertisement.rooms = this.validateNumberString(NewAdvertisement.rooms);
    NewAdvertisement.showerRooms = this.validateNumberString(
      NewAdvertisement.showerRooms
    );
    NewAdvertisement.privateParking = this.validateNumberString(
      NewAdvertisement.privateParking
    );
    NewAdvertisement.balconiesNumber = this.validateNumberString(
      NewAdvertisement.balconiesNumber
    );
    NewAdvertisement.numberOfPayments = this.validateNumberString(
      NewAdvertisement.numberOfPayments
    );
    NewAdvertisement.builtSquareMeters = this.validateNumberString(
      NewAdvertisement.builtSquareMeters
    );
    NewAdvertisement.gardenSquareMeters = this.validateNumberString(
      NewAdvertisement.builtSquareMeters
    );
    NewAdvertisement.minimumAmount = this.validateNumberString(
      NewAdvertisement.minimumAmount
    );
    NewAdvertisement.minimumAmount = this.validateNumberString(
      NewAdvertisement.minimumAmount
    );
    NewAdvertisement.builtSqpricePerMeteruareMeters = this.validateNumberString(
      NewAdvertisement.builtSqpricePerMeteruareMeters
    );
    NewAdvertisement.price = this.validateNumberString(NewAdvertisement.price);
    NewAdvertisement.totalSquareMeters = this.validateNumberString(
      NewAdvertisement.totalSquareMeters
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
      hasImage: NewAdvertisement.hasImage ?? false,
      hasPrice: NewAdvertisement.hasPrice ?? false,
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

    alert('המודעה נוספה בהצלחה');
    console.log(NewAdvertisement);

    this.httpClient
      .post<HttpResponse<any>>(
        `${this.Url}api/Users/CreateAdvertisement`,
        formData,
        { observe: 'response' }
      )
      .pipe(
        map((response) => {
          if (response.status === 200 || response.status === 204) {
            this.router.navigate(['/confirmation-modal']);
          }
        })
      )
      .subscribe((data) => {
        this.UserAdvertisements.next([
          ...this.UserAdvertisements.value,
          data as any,
        ]);
        // this.advertisementService.GetAdvertisements();
        // this.GetUsersAdvertisements();
      });
  }

  deleteAdvertisement(advertisementId: number) {
    this.httpClient
      .delete(`${this.Url}api/Users/DeleteAdvertisement/${advertisementId}`)
      .subscribe(() => {
        this.GetUsersAdvertisements();
      });
  }

  async updateAdvertisementToFavorites(advertisementId: number) {
    this.httpClient
      .post(`${this.Url}api/Users/user/updateFavorite/${advertisementId}`, null)
      .subscribe(() => {
        this.getUserFavoriteAdvertisements();
      });
  }

  async updateUserDetails(user: UserModel) {
    this.httpClient
      .put(`${this.Url}api/Users/user/update`, user)
      .subscribe(() => {
        this.GetUserDatails();
      });
  }
}
