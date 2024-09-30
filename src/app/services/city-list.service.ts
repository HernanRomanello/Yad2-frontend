import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CityListService {
  private fileUrl = 'assets/json/cityLists.txt';
  private fileUrlgovAPIUrl = 'assets/json/StreetLists.txt';
  govAPIUrl = environment.dataGovApiUrl;
  // private apiUrl = 'https://data.gov.il/api/3/action/datastore_search';

  constructor(private http: HttpClient) {}

  getCityList(): Observable<any> {
    return this.http.get<City[]>(this.fileUrl, { responseType: 'json' });
  }

  getAreaByCityName(cityNameHe: string, resourceId: string): Observable<any> {
    const filters = JSON.stringify({ city_name_he: cityNameHe });
    const url = `${this.govAPIUrl}?resource_id=${resourceId}&filters=${filters}`;

    return this.http.get<any>(url);
  }

  getStreetList(): Observable<any> {
    return this.http.get<Street[]>(this.fileUrlgovAPIUrl, {
      responseType: 'json',
    });
  }

  getStreetListByCity(city: string, streetList: Street[]): Street[] {
    return streetList.filter((s) => s.City_Name === city);
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
export interface Street {
  City_Name: string;
  Street_Code: number;
  Street_Name: string;
}
