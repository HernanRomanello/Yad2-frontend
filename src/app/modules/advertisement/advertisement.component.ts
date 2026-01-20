import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdvertisementService } from '../../services/advertisement.service';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { catchError } from 'rxjs';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css',
})
export class AdvertisementComponent {
  advertisement!: AdvertisementsModel;
  entryDate: string = '';
  adID = -1;
  constructor(
    private route: ActivatedRoute,
    private AdvertisementsService: AdvertisementService,
    public authService: AuthService,
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.adID = +params['id'];
        this.AdvertisementsService.GetAdvertisementById(+params['id'])
          .pipe(
            catchError((e) => {
              console.log(e);
              return [];
            }),
          )
          .subscribe((response) => {
            this.setAdvertisementAndFormatEntryDate(response);
          });
      }
    });
  }

  setAdvertisementAndFormatEntryDate(advertisement: AdvertisementsModel): void {
    this.advertisement = advertisement;

    const date = new Date(advertisement.entryDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    this.entryDate = `${day}/${month}/${year}`;
  }
  removeParenthesesContent(input: string): string {
    return input.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  }

  fillApartmentCondition(condition: boolean): string {
    if (condition) return 'text align-items';

    return 'light-text align-items';
  }

  isFavorite(advertisementId: number): boolean {
    return this.authService.UserFavoriteAdvertisements.value.some(
      (ad) => ad.id === advertisementId,
    );
  }
}
