import { HttpClient } from '@angular/common/http';
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AdvertisementsModel } from '../shared/models/AdvertisementsModel';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export const addsResolver: ResolveFn<AdvertisementsModel[]> = () => {
  const httpClient = inject(HttpClient);
  const apiUrl = environment.apiUrl;

  return httpClient
    .get<AdvertisementsModel[]>(`${apiUrl}/api/Advertisement/GetAdvertisements`)
    .pipe(
      catchError((error) => {
        console.log('resolver error', error);
        return of([]);
      }),
    );
};
