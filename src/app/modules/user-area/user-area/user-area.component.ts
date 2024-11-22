import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { UserModel } from '../../../shared/models/UserModel';
import { NavigationService } from '../../../services/navigation.service';

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
  navigationService = inject(NavigationService);
  userName: string = '';
  userLastname: string = '';
  UserEmailAddress: string = '';
  ngOnDestroy(): void {
    this.authService.isUserAreaOpen(false);
    this.navigationService.isUserAreaOpen(false);
    this.authService.IsHeaderAndFooterOpen(false, false);
    this.navigationService.IsHeaderAndFooterOpen(false, false);
    this.authService.SetPageRender('');
    window.scrollTo(0, 0);
    window.location.reload();
    this.authService.user.unsubscribe();
  }
  ngOnInit(): void {
    this.authService.isUserAreaOpen(true);
    this.navigationService.isUserAreaOpen(true);
    this.authService.IsalternativeHeaderISOpen.next(true);
    this.navigationService.isalternativeHeaderISOpen(true);
    this.authService.IsHeaderAndFooterOpen(true, false);
    this.navigationService.IsHeaderAndFooterOpen(true, false);
    this.authService.SetPageRender('user-area');

    this.authService.user.subscribe((user: UserModel | null | undefined) => {
      this.userName = user?.name || '';
      this.userLastname = user?.lastName || '';
      this.UserEmailAddress = user?.email || '';
    });
  }
}
