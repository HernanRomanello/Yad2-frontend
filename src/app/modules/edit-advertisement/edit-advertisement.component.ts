import {
  afterNextRender,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementService } from '../../services/advertisement.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-edit-advertisement',
  templateUrl: './edit-advertisement.component.html',
  styleUrls: [
    './edit-advertisement.component.css',
    '../create-new-advertisement/create-new-advertisement.component.css',
  ],
})
export class EditAdvertisementComponent implements OnInit, OnDestroy {
  advertisement!: AdvertisementsModel;
  isAssetAssetstateDropdownHidden = true;
  asset_State = '';
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
  ngOnDestroy(): void {
    this.authService.ISEditAdvertisementISOpen.next(false);
    this.authService.IsalternativeHeaderISOpen.next(false);
    this.authService.IsHeaderAndFooterOpen(true, true);
    this.authService.SetPageRender('');
  }

  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  advertisementService = inject(AdvertisementService);

  constructor() {
    afterNextRender(() => {
      document.body.addEventListener('click', (event) => {
        this.closeAllDropdowns();
      });
    });
  }

  ngOnInit(): void {
    this.authService.IsalternativeHeaderISOpen.next(true);
    this.authService.ISEditAdvertisementISOpen.next(true);
    this.authService.IsHeaderAndFooterOpen(true, false);

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.advertisementService
          .GetAdvertisementById(+params['id'])
          .pipe(
            catchError((e) => {
              console.log(e);
              return [];
            })
          )
          .subscribe((response) => {
            this.advertisement = response;
            this.asset_State = this.advertisement.assetState;
            console.log(this.advertisement);
          });
      }
    });
  }

  async handleSubmit() {}

  clearTotalFloors() {
    this.advertisement.totalFloors = 0;
  }

  selectOption(option: string, type: string) {
    this.SetDropDownVAlue(type, option, 'assetState');
    this.closeAllDropdowns();
  }

  private SetDropDownVAlue(type: string, option: string, dropdownType: string) {
    if (type === dropdownType) {
      this.asset_State = option;
      this.advertisement.assetState = option;
    }
  }

  closeAllDropdowns() {
    this.isAssetAssetstateDropdownHidden = true;
  }

  selectBtnOption(number: number, type: string, option: string) {
    if (type === 'airDirections') {
      this.advertisement.airDirections = number;
    } else if (type === 'view') {
      this.advertisement.view = option;
    } else if (type === 'privateParking') {
      this.advertisement.privateParking = number;
    } else if (type === 'balconiesNumber') {
      this.advertisement.balconiesNumber = number;
    }

    console.log(this.advertisement);
  }

  optionClass(option: number, fiveOptions: boolean): string {
    if (option === 4 && fiveOptions) {
      return 'option border-option-left';
    } else if (option === 3 && !fiveOptions) {
      return 'option border-option-left';
    } else if (option === 0) {
      return 'option border-option-right';
    } else {
      return 'option';
    }
  }
}
