import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdvertisementsModel } from '../shared/models/AdvertisementsModel';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  Advertisements: BehaviorSubject<AdvertisementsModel[]> = new BehaviorSubject<
    AdvertisementsModel[]
  >([]);
  Url = environment.URl;
  UserFavoriteAdvertisements: BehaviorSubject<AdvertisementsModel[]> =
    new BehaviorSubject<AdvertisementsModel[]>([]);
  constructor(private router: Router, private httpClient: HttpClient) {
    this.GetAdvertisements();
  }

  isFavorite(advertisementId: number): boolean {
    return this.UserFavoriteAdvertisements.getValue().some(
      (item) => item.id === advertisementId
    );
  }

  toggleFavorite(advertisementId: number) {
    const isFavorite = this.isFavorite(advertisementId);

    if (isFavorite) {
      this.UserFavoriteAdvertisements.next(
        this.UserFavoriteAdvertisements.getValue().filter(
          (item) => item.id !== advertisementId
        )
      );
    } else {
      this.UserFavoriteAdvertisements.next([
        ...this.UserFavoriteAdvertisements.getValue(),
        this.Advertisements.getValue().find(
          (item) => item.id === advertisementId
        ) as AdvertisementsModel,
      ]);
    }
  }

  GetAdvertisements() {
    this.httpClient
      .get<AdvertisementsModel[]>(
        `${this.Url}api/Advertisement/GetAdvertisements`
      )
      .subscribe((response) => {
        this.Advertisements.next(response);
      });
  }
}
