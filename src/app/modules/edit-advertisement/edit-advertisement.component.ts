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
  propertyFeaturesIcons: string[] = [
    'false',
    'accessible',
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
    'cold-svgrepo-com',
    'night_shelter',
    // 'sensor_door',
    'inventory_2',
    // 'solar_power',
    'drawers-svgrepo-com',
    'accessibility-svgrepo-com',
    'elevator-svgrepo-com',
    // 'לשותפים',
    'paint-svgrepo-com',

    'grid-svgrepo-com',
    'people-svgrepo-com',
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

  propertyFeatures: string[] = [
    'מיזוג',
    'ממ"ד',
    'מחסן',
    'ריהוט',
    ' גישה לנכים',
    'מעלית',
    'משופצת',
    'סורגים',
    'לשותפים',
    'חיות מחמד',
    'מטבח כשר',
    'דוד שמש',
    'דלתות רב-בריח',
    'מזגן טורנדו',
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

  selectPropertyFeatures(index: number) {
    // const propertyFeature = this.propertyFeaturesChecked[index];
    // var currentValue = !this.advertisementForm.get(propertyFeature.key).value;
    // this.advertisementForm.get(propertyFeature.key).setValue(currentValue);
    // if (propertyFeature.key === 'furnished') {
    //   if (currentValue) {
    //     this.furnitureDescription = true;
    //   } else {
    //     this.furnitureDescription = false;
    //   }
    // }
    // this.advertisementForm
    //   .get('airConditioner')
    //   .setValue(this.advertisementForm.get('tornadoAirConditioner').value);
  }
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
