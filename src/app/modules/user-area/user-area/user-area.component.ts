import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { UserModel } from '../../../shared/models/UserModel';

@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: [
    './user-area.component.css',
    '../../real-estate/real-estate-results/real-estate-results.component.css',
  ],
})
export class UserAreaComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  userName: string = '';
  userLastname: string = '';
  UserEmailAddress: string = '';
  activeLink = 'user-advertisement';
  ngOnDestroy(): void {
    this.authService.SetPageRender('');
    window.scrollTo(0, 0);
    window.location.reload();
    this.authService.user.unsubscribe();
  }
  ngOnInit(): void {
    this.authService.SetPageRender('user-area');

    this.authService.user.subscribe((user: UserModel | null | undefined) => {
      this.userName = user?.name || '';
      this.userLastname = user?.lastName || '';
      this.UserEmailAddress = user?.email || '';
    });
  }
}
