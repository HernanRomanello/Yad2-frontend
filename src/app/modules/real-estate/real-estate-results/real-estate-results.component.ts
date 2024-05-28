import { Component, inject } from '@angular/core';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementsModel } from '../../../shared/models/AdvertisementsModel';

@Component({
  selector: 'app-real-estate-results',
  templateUrl: './real-estate-results.component.html',
  styleUrls: [
    './real-estate-results.component.css',
    // '../../user-area/user-advertisement/user-advertisement.component.css',
  ],
})
export class RealEstateResultsComponent {
  public advertisementService = inject(AdvertisementService);
  // getFirstThreeAdvertisementParameters(
  //   advertisement: AdvertisementsModel
  // ): string[] {
  //   const conditions = [
  //     advertisement.airDirections > 0,
  //     advertisement.view !== '' &&
  //       advertisement.view !== null &&
  //       advertisement.view !== undefined &&
  //       advertisement.view !== 'none',
  //     advertisement.rearProperty,

  //     !!advertisement.showerRooms && advertisement.showerRooms !== '1',
  //     !!advertisement.privateParking,
  //     !!advertisement.balconies,
  //     advertisement.accessibleForDisabled,
  //     advertisement.airConditioning,
  //     advertisement.windowBars,
  //     advertisement.solarWaterHeater,
  //     advertisement.elevator,
  //     advertisement.forRoommates,
  //     advertisement.furnished,
  //     advertisement.separateUnit,
  //     advertisement.kosherKitchen,
  //     advertisement.petsAllowed,
  //     advertisement.renovated,
  //     advertisement.safeRoom,
  //     advertisement.multiLockDoors,
  //     advertisement.tornadoAirConditioner,
  //     advertisement.storageRoom,
  //   ];

  //   const words = [
  //     `${advertisement.airDirections}כיווני אוויר `,
  //     `נוף ${advertisement.view}`,
  //     'נכס עורפי',
  //     `${advertisement.showerRooms}חדרי מקלחת`,
  //     'חניה',
  //     `${advertisement.balconies}`,
  //     'גישה לנכים',
  //     'מיזוג',
  //     'סורגים',
  //     'דוד שמש',
  //     'מעלית',
  //     'לשותפים',
  //     'ריהוט',
  //     'יחידת דיור',
  //     'מטבח כשר',
  //     'חיות מחמד',
  //     'משופצת',
  //     'ממ"ד',
  //     'דלתות רב-בריח',
  //     'מזגן טורנדו',
  //     'מחסן',
  //   ];

  //   const selected: string[] = [];

  //   for (let i = 0; i < conditions.length; i++) {
  //     if (conditions[i]) {
  //       selected.push(words[i]);
  //     }
  //     if (selected.length === 3) {
  //       break;
  //     }
  //   }
  //   return selected;
  // }
}
