import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserModel } from '../../../shared/models/UserModel';
import { AuthService } from '../../../services/user/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css'],
})
export class EditDetailsComponent implements OnInit, OnDestroy {
  $user: UserModel | null = null;
  $updatedUser: FormGroup | any;

  phoneNumber: string = '';
  formattedBirthDate: string = '';
  private userSubscription: Subscription | undefined;

  constructor(
    private userService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.userSubscription = (
      this.userService.user as BehaviorSubject<UserModel | null>
    ).subscribe((user) => {
      this.$user = user;
      this.phoneNumber = user?.phoneNumber || '';
    });

    this.$updatedUser = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      birthDate: ['', [Validators.required]],
      city: [this.$user?.city, [Validators.required]],
      street: ['', [Validators.required]],
      houseNumber: ['', [Validators.required]],
    });
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
      alert('Please fill all the required fields');

      // Loop through each control in the form to find specific errors
      Object.keys(this.$updatedUser.controls).forEach((field) => {
        const control = this.$updatedUser.get(field);

        if (control && control.errors) {
          console.log(`Error in field: ${field}`, control.errors);
        }
      });
    } else {
      console.log('User updated');
    }
    // this.userService.updateUserDetails(this.$user);
  }
}
