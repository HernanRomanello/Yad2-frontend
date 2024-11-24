import { ResolveFn } from '@angular/router';
import { AdvertisementsModel } from '../shared/models/AdvertisementsModel';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export const favoritesAdResolver: ResolveFn<AdvertisementsModel[] | null> = (
  route,
  state
) => {
  const httpClient = inject(HttpClient);
  const URL = environment.URl;
  return httpClient.get<AdvertisementsModel[]>(`${URL}api/Users/GetFavorites`);
};
