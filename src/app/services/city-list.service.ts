import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CityListService {
  private fileUrl = 'assets/json/cityLists.txt';
  private fileUrlgovAPIUrl = 'assets/json/StreetLists.txt';
  govAPIUrl = environment.dataGovApiUrl;

  constructor(private http: HttpClient) {}

  getCityList(): Observable<any> {
    return this.http.get<City[]>(this.fileUrl, { responseType: 'json' });
  }

  getStreetList(): Observable<any> {
    return this.http.get<Street[]>(this.fileUrlgovAPIUrl, {
      responseType: 'json',
    });
  }

  getStreetListByCity(city: string, streetList: Street[]): Street[] {
    return streetList.filter((s) => s.City_Name === city);
  }

  getCityDataFromAPI(): Observable<any> {
    const resourceId = 'your_resource_id_here'; // Replace with actual resource_id
    const query = 'אבו גוש'; // Hebrew for "Abu Ghosh"

    // Set query parameters for the API call
    const params = new HttpParams()
      .set('resource_id', resourceId)
      .set('q', query);

    // Make the HTTP GET request
    return this.http.get<any>(this.govAPIUrl, { params });
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
