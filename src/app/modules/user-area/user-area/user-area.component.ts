import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';

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
  ngOnDestroy(): void {
    // this.authService.IsalternativeHeaderISOpen.next(false);
    this.authService.isUserAreaOpen(false);
    this.authService.IsHeaderAndFooterOpen(false, false);
    this.authService.SetPageRender('');
    window.scrollTo(0, 0);
    window.location.reload();
  }
  ngOnInit(): void {
    // this.authService.IsUserAreaISOpen.next(true);
    this.authService.isUserAreaOpen(true);
    this.authService.IsalternativeHeaderISOpen.next(true);
    this.authService.IsHeaderAndFooterOpen(true, true);
    this.authService.SetPageRender('user-area');
  }
}
