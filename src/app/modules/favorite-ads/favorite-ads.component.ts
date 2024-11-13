import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-favorite-ads',
  templateUrl: './favorite-ads.component.html',
  styleUrl: './favorite-ads.component.css',
})
export class FavoriteAdsComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.isFavoritesAdIsOpen(true);
  }

  ngOnDestroy() {
    this.authService.isFavoritesAdIsOpen(false);
  }
}
