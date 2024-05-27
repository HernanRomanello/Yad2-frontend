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
  UserFavoriteAdvertisements: any;
  constructor(private router: Router, private httpClient: HttpClient) {
    this.GetAdvertisements();
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
