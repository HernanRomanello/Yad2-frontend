import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityListService {
  private fileUrl = 'assets/json/cityLists.txt'; // Path to your file

  constructor(private http: HttpClient) {}

  getCityList(): Observable<any> {
    return this.http.get<City[]>(this.fileUrl, { responseType: 'json' });
  }
}
export interface City {
  PIBA_bureau_code: number;
  PIBA_bureau_name: string;
  Regional_Council_code: number;
  Regional_Council_name: string;
  city_code: number;
  city_name_en: string;
  city_name_he: string;
  region_code: number;
  region_name: string;
}
