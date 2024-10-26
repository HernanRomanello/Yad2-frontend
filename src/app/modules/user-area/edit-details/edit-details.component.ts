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
  $user = new BehaviorSubject<UserModel | null>(null);
  phoneNumber: string = '';
  private userSubscription: Subscription | undefined;

  constructor(private userService: AuthService) {}

  ngOnInit() {
    // Subscribe to the user BehaviorSubject to get updates
    this.userSubscription = (
      this.userService.user as BehaviorSubject<UserModel | null>
    ).subscribe((user) => {
      this.$user.next(user);
      this.phoneNumber = user?.phoneNumber || '';
      console.log(this.phoneNumber);
    });
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
}
