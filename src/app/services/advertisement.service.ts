import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdvertisementsModel } from '../shared/models/AdvertisementsModel';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './user/auth.service';
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
  authService = inject(AuthService);

  AirDirections = [1, 2, 3, 4];
  viewOptions: string[] = ['ללא', 'לים', 'לפארק', 'לעיר'];
  privateParking = [0, 1, 2, 3];
  balconiesNumber = [0, 1, 2, 3, 4];
  propertyFeaturesIcons: string[] = [
    'accessible',
    'false',
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
    'cold-svgrepo-com',
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

  propertyFeaturesChecked: { key: string; checked: boolean }[] = [
    { key: 'accessibleForDisabled', checked: false }, // גישה לנכים
    { key: 'airConditioning', checked: false }, // מיזוג
    { key: 'windowBars', checked: false }, // סורגים
    { key: 'solarWaterHeater', checked: false }, // דוד שמש
    { key: 'elevator', checked: false }, // מעלית
    { key: 'forRoommates', checked: false }, // לשותפים
    { key: 'furnished', checked: false }, // ריהוט
    { key: 'separateUnit', checked: false }, // יחידת דיור
    { key: 'kosherKitchen', checked: false }, // מטבח כשר
    { key: 'petsAllowed', checked: false }, // חיות מחמד
    { key: 'renovated', checked: false }, // משופצת
    { key: 'safeRoom', checked: false }, // ממ"ד
    { key: 'multiLockDoors', checked: false }, // דלתות רב-בריח
    { key: 'tornadoAirConditioner', checked: false }, // מזגן טורנדו
    { key: 'storageRoom', checked: false }, // מחסן
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

  numberOfPayments: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    'גמיש',
  ];

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

  convertDateToUnixTimestamp(dateString: string): number {
    const date = new Date(dateString);

    return date.getTime();
  }

  updateAdvertisement(
    advertisement: AdvertisementsModel,
    id: number,
    pictures: any
  ): void {
    const date = this.convertDateToUnixTimestamp(advertisement.entryDate);

    const updatedAd = {
      city: advertisement.city,
      tradeType: advertisement.tradeType,
      street: advertisement.street,
      number: advertisement.number,
      floor: advertisement.floor,
      totalFloors: advertisement.totalFloors,
      onPillars: advertisement.onPillars,
      neighborhood: advertisement.neighborhood,
      area: advertisement.area,
      assetType: advertisement.assetType,
      assetState: advertisement.assetState,
      airDirections: advertisement.airDirections,
      view: advertisement.view,
      rearProperty: advertisement.rearProperty,
      rooms: advertisement.rooms,
      showerRooms: advertisement.showerRooms,
      privateParking: advertisement.privateParking,
      hasPrivateParking: advertisement.hasPrivateParking,
      hasBolcony: advertisement.hasBolcony,
      hasImage: advertisement.hasImage,
      hasPrice: advertisement.hasPrice,
      moshavOrKibutz: advertisement.moshavOrKibutz,
      publisherIsMiddleMan: advertisement.publisherIsMiddleMan,
      publisherIsContractor: advertisement.publisherIsContractor,
      balconiesNumber: advertisement.balconiesNumber,
      accessibleForDisabled: advertisement.accessibleForDisabled,
      airConditioning: advertisement.airConditioning,
      windowBars: advertisement.windowBars,
      solarWaterHeater: advertisement.solarWaterHeater,
      elevator: advertisement.elevator,
      forRoommates: advertisement.forRoommates,
      furnished: advertisement.furnished,
      separateUnit: advertisement.separateUnit,
      kosherKitchen: advertisement.kosherKitchen,
      petsAllowed: advertisement.petsAllowed,
      renovated: advertisement.renovated,
      safeRoom: advertisement.safeRoom,
      multiLockDoors: advertisement.multiLockDoors,
      airConditioner: advertisement.airConditioner,
      tornadoAirConditioner: advertisement.tornadoAirConditioner,
      storageRoom: advertisement.storageRoom,
      description: advertisement.description,
      furnituredescription: advertisement.furnituredescription,
      numberOfPayments: advertisement.numberOfPayments,
      houseCommitteePayment: advertisement.houseCommitteePayment,
      municipalityMonthlyPropertyTax:
        advertisement.municipalityMonthlyPropertyTax,
      builtSquareMeters: advertisement.builtSquareMeters,
      gardenSquareMeters: advertisement.gardenSquareMeters,
      totalSquareMeters: advertisement.totalSquareMeters,
      price: advertisement.price,
      minimumAmount: advertisement.minimumAmount,
      pricePerMeter: advertisement.pricePerMeter,
      entryDate: date,
      immediate: advertisement.immediate,
      flexible: advertisement.flexible,
      longTerm: advertisement.longTerm,

      pictures: pictures,
      mainPicture: advertisement.mainPicture,
      video: advertisement.video,
      contactName: advertisement.contactName,
      secondContactName: advertisement.secondContactName,
      contactPhone: advertisement.contactPhone,
      secondContactPhone: advertisement.secondContactPhone,
      standardizationAccepted: advertisement.standardizationAccepted,
    };

    this.httpClient
      .put(`${this.Url}api/Users/UpdateAdvertisement/${id}`, updatedAd)
      .subscribe(
        (data) => {
          this.authService.GetUsersAdvertisements();
          this.GetAdvertisements();
        },
        (error) => {
          console.error('Error updating advertisement:', error);
        }
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

  src(image: any) {
    return URL.createObjectURL(image);
  }
}
