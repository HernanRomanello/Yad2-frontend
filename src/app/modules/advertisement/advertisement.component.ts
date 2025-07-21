import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdvertisementService } from '../../services/advertisement.service';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { catchError } from 'rxjs';
import { AuthService } from '../../services/user/auth.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css',
})
export class AdvertisementComponent implements OnInit, OnDestroy {
  advertisement!: AdvertisementsModel;
  entryDate: string = '';
  adID = -1;
  constructor(
    private route: ActivatedRoute,
    private AdvertisementsService: AdvertisementService,
    public authService: AuthService,
    private navigationService: NavigationService
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.adID = +params['id'];
        this.AdvertisementsService.GetAdvertisementById(+params['id'])
          .pipe(
            catchError((e) => {
              console.log(e);
              return [];
            })
          )
          .subscribe((response) => {
            this.advertisement = response;
            const date = new Date(this.advertisement.entryDate);
            console.log(this.advertisement.entryDate);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);
            this.entryDate = `${day}/${month}/${year}`;
          });
      }
    });
  }
  removeParenthesesContent(input: string): string {
    return input.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  }

  ngOnDestroy() {
    this.navigationService.IsAdpageOpen.set(false);
  }

  ngOnInit() {
    this.navigationService.IsAdpageOpen.set(true);
  }

  fillApartmentCondition(condition: boolean): string {
    if (condition) {
      return 'text align-items';
    } else {
      return 'light-text align-items';
    }
  }

  isFavorite(advertisementId: number): boolean {
    return this.authService.UserFavoriteAdvertisements.value.some(
      (ad) => ad.id === advertisementId
    );
  }
}
