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
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
  advertisementForm: FormGroup | any;
  isAssetAssetstateDropdownHidden = true;
  asset_State = '';
  AirDirections = [1, 2, 3, 4];
  viewOptions: string[] = ['ללא', 'לים', 'לפארק', 'לעיר'];

  assetConditions = [
    'חדש מקבלן (לא גרו בו בכלל)',
    'חדש (נכס בן עד 10 שנים)',
    'משופץ (שופץ ב5 השנים האחרונות)',
    'במצב שמור (במצב טוב, לא שופץ)',
    'דרוש שיפוץ (זקוק לעבודת שיפוץ)',
  ];
  ngOnDestroy(): void {
    this.authService.ISEditAdvertisementISOpen.next(false);
    this.authService.IsalternativeHeaderISOpen.next(false);
    this.authService.IsHeaderAndFooterOpen(true, true);
    this.authService.SetPageRender('');
  }

  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  constructor(private advertisementService: AdvertisementService) {
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
    this.advertisementForm = this.formBuilder.group({
      city: [this.authService.user.getValue()?.city || '', Validators.required],
      tradeType: ['', Validators.required],
      street: [
        this.authService.user.getValue()?.street || '',
        Validators.required,
      ],
      number: [
        this.authService.user.getValue()?.houseNumber || '',
        Validators.required,
      ],
      floor: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      totalFloors: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      onPillars: [false],
      neighborhood: ['', Validators.required],
      area: ['', Validators.required],
      assetType: ['', Validators.required],
      assetState: [this.asset_State, Validators.required],
      airDirections: [1],
      view: ['', Validators.required],
      rearProperty: [false],
      rooms: ['', Validators.required],
      showerRooms: ['', Validators.required],
      privateParking: [false],
      hasPrivateParking: [false],
      hasBolcony: [false],
      hasImage: [false],
      hasPrice: [false],
      needsRenovation: [false],
      isWellMaintained: [false],
      isRenovated: [false],
      isNew: [false],
      priceDiscount: [false],
      publisherIsMiddleMan: [false],
      publisherIsContractor: [false],
      balconiesNumber: 0,
      accessibleForDisabled: [false],
      airConditioning: [false],
      windowBars: [false],
      solarWaterHeater: [false],
      elevator: [false],
      forRoommates: [false],
      furnished: [false],
      separateUnit: [false],
      kosherKitchen: [false],
      petsAllowed: [false],
      renovated: [false],
      safeRoom: [false],
      multiLockDoors: [false],
      airConditioner: [false],
      tornadoAirConditioner: [false],
      storageRoom: [false],
      description: ['', Validators.required],
      furnituredescription: ['', Validators.required],
      numberOfPayments: [null, [Validators.required]],
      houseCommitteePayment: [null],
      municipalityMonthlyPropertyTax: [null],
      builtSquareMeters: [null],
      gardenSquareMeters: [null],
      totalSquareMeters: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      price: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      minimumAmount: [null],
      pricePerMeter: [null],
      entryDate: ['', Validators.required],
      immediate: [false],
      flexible: [false],
      longTerm: [false],
      pictures: [[]],
      video: [''],
      contactName: [
        this.authService.user.getValue()?.name || '',
        Validators.required,
      ],
      contactPhone: [
        this.authService.user.getValue()?.phoneNumber || '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      standardizationAccepted: [false],
    });
  }

  toggleDropdown(btnType: string) {}

  async handleSubmit() {}

  selectOption(option: string, type: string) {
    // this.openAndCloseButtons(type);
    // if (type === 'assetType') {
    //   this.asset_type = option;
    //   this.setAssetType(option);
    // } else
    // } else if (type === 'rooms') {
    //   this.asset_Rooms = option;
    //   this.set_Number_Of_Rooms(option);
    // } else if (type === 'numberOfPayments') {
    //   this.number_Of_Payments = option;
    //   this.set_Number_Of_Payments(option);
    // } else if (type === 'asset_owner') {
    //   this.asset_owner = option;
    // }
    this.SetDropDownVAlue(type, option, 'assetState');
    this.closeAllDropdowns();

    console.log(this.advertisementForm.value);
  }

  private SetDropDownVAlue(type: string, option: string, dropdownType: string) {
    if (type === dropdownType) {
      this.asset_State = option;
      this.advertisementForm.get(dropdownType).setValue(option);
    }
  }

  closeAllDropdowns() {
    this.isAssetAssetstateDropdownHidden = true;
  }

  selectBtnOption(direction: number, type: string, view: string) {
    if (type === 'airDirections') {
      this.advertisementForm.get(type).setValue(direction);
      this.advertisement.airDirections = direction;
    }
    if (type === 'view') {
      this.advertisementForm.get('view').setValue(view);
    }
    console.log(this.advertisementForm.value);
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
