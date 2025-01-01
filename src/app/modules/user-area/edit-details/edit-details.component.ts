import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UserModel } from '../../../shared/models/UserModel';
import { AuthService } from '../../../services/user/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  state,
  trigger,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  CityListService,
  City,
  Street,
} from '../../../services/city-list.service';
import { ImageuploadService } from '../../../services/imageupload.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css'],
  animations: [
    trigger('modalEnterExit', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(100%)' })),
      transition('void => in', [
        style({ transform: 'translateX(-100%)' }),
        animate('2000ms ease-in'),
      ]),
      transition('in => out', [
        animate('2000ms linear', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class EditDetailsComponent implements OnInit, OnDestroy {
  deleteImageOption: boolean = false;
  $user: UserModel | null = null;
  $updatedUser: FormGroup | any;
  successMessageVisible: boolean = false;
  modalState: 'in' | 'out' = 'out';
  isCityDropdownHidden = false;

  isStreetDropdownHidden = false;
  isProfileImageDropdownHidden = false;
  isProfileImageModal = false;
  @ViewChild('successLoader', { static: false }) successLoader:
    | ElementRef
    | undefined;

  phoneNumber: string = '';
  formattedBirthDate: string = '';

  private userSubscription: Subscription | undefined;
  $cities: City[] = [];
  $streets: Street[] = [];
  $cityOptions: City[] = [];
  $streetsOptions: Street[] = [];
  chosenCity: string = '';
  chosenStreet: string = '';
  chosenHouseNumber: string = '';
  InvalidCity: boolean = false;
  InvalidStreet: boolean = false;
  InvalidHouseNumber: boolean = false;
  validCityCharcters: number = 0;
  cityWasEdited: boolean = false;
  profileImageURL: string = '';
  profileImage: File | null = null;

  constructor(
    private userService: AuthService,
    private formBuilder: FormBuilder,
    private cityListService: CityListService,
    private imageuploadService: ImageuploadService
  ) {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.id !== 'CityInput') {
        this.isCityDropdownHidden = false;
      }
      if (target.id !== 'street') {
        this.isStreetDropdownHidden = false;
      }
      if (
        target.id !== 'edit-image' &&
        target.id !== 'edit-img' &&
        target.id !== 'pencil-image' &&
        target.id !== 'delete-img'
      ) {
        this.isProfileImageDropdownHidden = false;
      }
    });
  }

  toogleImageModal(event: any) {
    this.isProfileImageModal = event;
  }

  unloadSuccessLoader(): void {
    let width = 100;
    const interval = setInterval(() => {
      if (width > 0) {
        width--;
        if (this.successLoader) {
          this.successLoader.nativeElement.style.width = width + '%';
        }
      } else {
        clearInterval(interval);
      }
    }, 120);
  }

  ngOnInit() {
    this.userSubscription = (
      this.userService.user as BehaviorSubject<UserModel | null>
    ).subscribe((user) => {
      this.$user = user;
      this.phoneNumber =
        user?.phoneNumber?.slice(0, 3) + '-' + user?.phoneNumber?.slice(3, 10);
      this.profileImageURL = user?.picture || '';

      this.$updatedUser = this.formBuilder.group({
        name: [this.$user?.name, [Validators.required]],
        lastName: [this.$user?.lastName, [Validators.required]],
        phoneNumber: [this.$user?.phoneNumber || '', [Validators.required]],
        email: [this.$user?.email, [Validators.required, Validators.email]],
        birthDate: [this.$user?.birthDate],
        city: [this.$user?.city, [Validators.required]],
        street: [this.$user?.street, [Validators.required]],
        houseNumber: [
          this.chosenHouseNumber,
          [Validators.required, Validators.pattern(/^\d+$/)],
        ],
      });
      this.chosenCity = this.$user?.city || '';
      this.chosenStreet = this.$user?.street || '';
      this.chosenHouseNumber = this.$user?.houseNumber.toString() || '';
      this.validCityCharcters = this.$user?.city?.length || 0;
    });
    this.cityListService.getCityList().subscribe((cities) => {
      this.$cities = cities;
    });
    this.cityListService.getStreetList().subscribe((streets) => {
      this.$streets = streets;
    });
  }

  uploadProfileImage(file: any) {
    if (file) {
      this.profileImage = file;
      this.profileImageURL = URL.createObjectURL(file);
    }
  }

  serchCity(searchQuery: string) {
    this.$cityOptions = this.cityListService.getFirstsCitiesContainingSubstring(
      this.$cities,
      searchQuery,
      'city_name_he',
      10
    );
  }

  serchStreet(searchQuery: string) {
    const streetsOptions = this.$streets.filter(
      (s) => s.City_Name.toLowerCase() === this.chosenCity.toLowerCase()
    );
    this.$streetsOptions = this.cityListService.getStreetSuggestions(
      this.chosenCity,
      searchQuery,
      streetsOptions,
      4
    );
  }

  checkIfValidCity(city: string): boolean {
    const CityName = city;

    const validCity = this.$cities.find(
      (city: City) => city.city_name_he === CityName
    );

    return validCity ? true : false;
  }

  checkIfValidStreet(Street: string): boolean {
    const streetName = Street;

    const validstreet = this.$streets.find(
      (street: Street) =>
        street.Street_Name === streetName &&
        street.City_Name === this.chosenCity
    );

    return validstreet ? true : false;
  }

  formatDateString(dateString: string | undefined): string {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  onPhoneNumberChange(value: string): void {
    this.phoneNumber = this.phoneNumberFormat(value);
  }

  phoneNumberFormat(phoneNumber: string): string {
    const isNumber = /^[0-9]*$/.test(phoneNumber);

    if (isNumber && phoneNumber.length > 3) {
      const firstThree = phoneNumber.slice(0, 3);
      const secondThree = phoneNumber.slice(3, 10);
      phoneNumber = firstThree + '-' + secondThree;
    }

    return phoneNumber;
  }

  resetUserAddress(validCity: boolean, validStreet: boolean): void {
    if (!validCity && !this.cityWasEdited) {
      this.$updatedUser.controls.street.setValue('');
      this.$updatedUser.controls.houseNumber.setValue('');

      this.chosenStreet = '';
      this.chosenCity = '';
      this.chosenHouseNumber = '';
      this.$updatedUser.controls.city.setValue('');
      this.cityWasEdited = true;
      return;
    }

    if (!validStreet) {
      this.$updatedUser.controls.houseNumber.setValue('');
      this.chosenHouseNumber = '';
    }
  }
  checkIfAddressIsValid(): boolean {
    return (
      this.checkIfValidCity(this.chosenCity) &&
      this.checkIfValidStreet(this.chosenStreet) &&
      +this.chosenHouseNumber > 0
    );
  }
  updateUserDetails(): void {
    if (!this.$user || !this.checkIfAddressIsValid()) {
      return;
    }

    this.$user.city = this.chosenCity;
    this.$user.street = this.chosenStreet;
    this.$user.houseNumber = +this.chosenHouseNumber;

    if (this.profileImage && this.profileImage && this.profileImageURL !== '') {
      this.imageuploadService.uploadImage(this.profileImage);
      this.$user.picture =
        environment.URl + 'uploads/' + this.profileImage.name;
    } else {
      this.$user.picture = '';
    }

    const validAddress =
      this.checkIfValidCity(this.chosenCity) &&
      this.checkIfValidStreet(this.chosenStreet);
    if (this.$user.phoneNumber && validAddress) {
      this.$user.phoneNumber = this.$user.phoneNumber.replace('-', '');
      this.userService.updateUserDetails(this.$user);
      this.successMessageVisible = true;
      this.modalState = 'in';

      setTimeout(() => {
        this.modalState = 'out';
      }, 12000);

      setTimeout(() => {
        this.successMessageVisible = false;
      }, 13900);
    }
  }
}
