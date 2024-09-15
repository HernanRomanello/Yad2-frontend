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
  advertisementResult: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  AirDirections = [1, 2, 3, 4];
  viewOptions: string[] = ['ללא', 'לים', 'לפארק', 'לעיר'];
  privateParking = [0, 1, 2, 3];
  balconiesNumber = [0, 1, 2, 3];
  propertyFeaturesIcons: string[] = [
    'accessible',
    'ac_unit',
    'false',
    'false',
    'false',
    'people_outline',
    'false',
    'false',
    'false',
    'pets',
    'format_paint',
    'false',
    'false',
    'false',
    'false',
  ];

  propertyFeaturesImages: string[] = [
    'false',
    'false',
    'sensor_door',
    'solar_power',
    'elevator',
    'לשותפים',
    'dresser',
    'night_shelter',
    'circle',
    'חיות מחמד',
    'משופצת',
    'deployed_code',
    'sensor_door',
    'air_purifier_gen',
    'inventory_2',
  ];

  assetConditions = [
    'חדש מקבלן (לא גרו בו בכלל)',
    'חדש (נכס בן עד 10 שנים)',
    'משופץ (שופץ ב5 השנים האחרונות)',
    'במצב שמור (במצב טוב, לא שופץ)',
    'דרוש שיפוץ (זקוק לעבודת שיפוץ)',
  ];

  propertyFeatures: string[] = [
    ' גישה לנכים',
    'מיזוג',
    'סורגים',
    'דוד שמש',
    'מעלית',
    'לשותפים',
    'ריהוט',
    'יחידת דיור',
    'מטבח כשר',
    'חיות מחמד',
    'משופצת',
    'ממ"ד',
    'דלתות רב-בריח',
    'מזגן טורנדו',
    'מחסן',
  ];
  ShowerRooms = [1, 2, 3, 4];

  constructor(private router: Router, private httpClient: HttpClient) {
    this.GetAdvertisements();
  }

  isFavorite(advertisementId: number): boolean {
    return this.UserFavoriteAdvertisements.getValue().some(
      (item) => item.id === advertisementId
    );
  }

  GetAdvertisements() {
    this.httpClient
      .get<AdvertisementsModel[]>(
        `${this.Url}api/Advertisement/GetAdvertisements`
      )
      .subscribe((response) => {
        this.Advertisements.next(response);
        this.advertisementResult.next(response.length);
      });
  }

  GetAdvertisementById(id: number) {
    return this.httpClient.get<AdvertisementsModel>(
      `${this.Url}api/Advertisement/GetAdvertisement/${id}`
    );
  }

  getFirstThreeAdvertisementParameters(
    advertisement: AdvertisementsModel
  ): string[] {
    const conditions = [
      advertisement.airDirections > 0,
      advertisement.view !== '' &&
        advertisement.view !== null &&
        advertisement.view !== undefined &&
        advertisement.view !== 'none',
      advertisement.rearProperty,

      !!advertisement.showerRooms && advertisement.showerRooms !== '1',
      !!advertisement.privateParking,
      !!advertisement.hasBolcony,
      advertisement.accessibleForDisabled,
      advertisement.airConditioning,
      advertisement.windowBars,
      advertisement.solarWaterHeater,
      advertisement.elevator,
      advertisement.forRoommates,
      advertisement.furnished,
      advertisement.separateUnit,
      advertisement.kosherKitchen,
      advertisement.petsAllowed,
      advertisement.renovated,
      advertisement.safeRoom,
      advertisement.multiLockDoors,
      advertisement.tornadoAirConditioner,
      advertisement.storageRoom,
    ];

    const words = [
      `${advertisement.airDirections}כיווני אוויר `,
      `נוף ${advertisement.view}`,
      'נכס עורפי',
      `${advertisement.showerRooms}חדרי מקלחת`,
      'חניה',
      `${advertisement.hasBolcony}`,
      'גישה לנכים',
      'מיזוג',
      'סורגים',
      'דוד שמש',
      'מעלית',
      'לשותפים',
      'ריהוט',
      'יחידת דיור',
      'מטבח כשר',
      'חיות מחמד',
      'משופצת',
      'ממ"ד',
      'דלתות רב-בריח',
      'מזגן טורנדו',
      'מחסן',
    ];

    const selected: string[] = [];

    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i]) {
        selected.push(words[i]);
      }
      if (selected.length === 3) {
        break;
      }
    }
    return selected;
  }
}
