import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserModel } from '../../../shared/models/UserModel';
import { AuthService } from '../../../services/user/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css'],
})
export class EditDetailsComponent implements OnInit, OnDestroy {
  $user: UserModel | null = null;
  phoneNumber: string = '';
  formattedBirthDate: string = '';
  private userSubscription: Subscription | undefined;

  constructor(private userService: AuthService) {}

  ngOnInit() {
    this.userSubscription = (
      this.userService.user as BehaviorSubject<UserModel | null>
    ).subscribe((user) => {
      this.$user = user;
      this.phoneNumber = user?.phoneNumber || '';
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
    this.userService.updateUserDetails(this.$user);
  }
}
