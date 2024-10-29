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

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css'],
  animations: [
    trigger('modalEnterExit', [
      state('in', style({ transform: 'translateX(0)' })), // No translation when in
      state('out', style({ transform: 'translateX(100%)' })), // Move out to the right
      transition('void => in', [
        style({ transform: 'translateX(-100%)' }), // Start from the left
        animate('2000ms ease-in'), // Animate in
      ]),
      transition('in => out', [
        animate('2000ms linear', style({ transform: 'translateX(-100%)' })), // Animate out to the right
      ]),
    ]),
  ],
})
export class EditDetailsComponent implements OnInit, OnDestroy {
  $user: UserModel | null = null;
  $updatedUser: FormGroup | any;
  successMessageVisible: boolean = false;
  modalState: 'in' | 'out' = 'out';
  isCityDropdownHidden = false;
  isStreetDropdownHidden = false;
  @ViewChild('successLoader', { static: false }) successLoader:
    | ElementRef
    | undefined;

  phoneNumber: string = '';
  formattedBirthDate: string = '';

  private userSubscription: Subscription | undefined;
  $cities: City[] = [];
  $cityOptions: City[] = [];
  $streets: Street[] = [];
  $streetsOptions: Street[] = [];

  constructor(
    private userService: AuthService,
    private formBuilder: FormBuilder,
    private cityListService: CityListService
  ) {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.id !== 'CityInput') {
        this.isCityDropdownHidden = false;
      }
    });
  }

  handleLoad = (): void => {
    alert('Hello from the other side (Component Loaded)');
  };

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
      this.$updatedUser = this.formBuilder.group({
        name: [this.$user?.name, [Validators.required]],
        lastName: [this.$user?.lastName, [Validators.required]],
        phoneNumber: [this.$user?.phoneNumber || '', [Validators.required]],
        email: [this.$user?.email, [Validators.required, Validators.email]],
        birthDate: [this.$user?.birthDate],
        city: [this.$user?.city, [Validators.required]],
        street: [this.$user?.street, [Validators.required]],
        houseNumber: [this.$user?.houseNumber, [Validators.required]],
      });
    });
    this.cityListService.getCityList().subscribe((cities) => {
      this.$cities = cities;
    });
    this.cityListService.getStreetList().subscribe((streets) => {
      this.$streets = streets;
    });
  }

  serchCity(searchQuery: string) {
    this.$cityOptions = this.cityListService.getFirstsCitiesContainingSubstring(
      this.$cities,
      searchQuery,
      'city_name_he',
      10
    );
    console.log(this.$cityOptions);
  }

  serchStreet(city: string, searchQuery: string) {
    this.$streetsOptions = this.cityListService.getStreetSuggestions(
      city,
      searchQuery,
      this.$streets,
      10
    );
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

  updateUserDetails(): void {
    if (!this.$user) {
      return;
    }

    console.log(this.$user);
    if (this.$updatedUser.invalid) {
      Object.keys(this.$updatedUser.controls).forEach((field) => {
        const control = this.$updatedUser.get(field);

        if (control && control.errors) {
          console.log(`Error in field: ${field}`, control.errors);
        }
      });
    } else {
      if (this.$user.phoneNumber) {
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
}
