import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityListService {
  private fileUrl = 'assets/json/cityLists.txt';
  private fileUrlgovAPIUrl = 'assets/json/StreetLists.txt';

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

  getFirstsCitiesContainingSubstring(
    cities: City[],
    substring: string,
    property: keyof City,
    resultsNumber: number
  ): City[] {
    return cities
      .filter((city) => {
        const value = city[property];
        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(substring.toLowerCase()) &&
          value.startsWith(substring)
        );
      })
      .slice(0, resultsNumber);
  }

  getStreetSuggestions(
    city: string,
    substring: string,
    streets: Street[],
    resultsNumber: number
  ): Street[] {
    return this.getStreetListByCity(city, streets)
      .filter((street) => {
        const value = street.Street_Name;
        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(substring.toLowerCase())
        );
      })
      .slice(0, resultsNumber);
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
