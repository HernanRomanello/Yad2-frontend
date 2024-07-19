import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { ImageuploadService } from '../../services/imageupload.service';
import { afterNextRender } from '@angular/core';

@Component({
  selector: 'app-create-new-advertisement',
  templateUrl: './create-new-advertisement.component.html',
  styleUrls: ['./create-new-advertisement.component.css'],
})
export class CreateNewAdvertisementComponent implements OnInit {
  advertisementForm!: FormGroup | any;
  asset_type: string | undefined = undefined;
  asset_State: string | undefined = undefined;
  asset_Rooms: string | undefined = undefined;
  images: File[] = [];
  video: File | undefined = undefined;
  authService = inject(AuthService);
  imageService = inject(ImageuploadService);
  formBuilder = inject(FormBuilder);
  isAssetTypeDropdownHidden = false;
  isAssetAssetstateDropdownHidden = false;
  isRoomsDropdownHidden = false;
  @ViewChild('dropdownIconAsset_State', { static: false })
  dropdownIconAsset_State!: ElementRef;
  @ViewChild('dropdownIconAsset_type', { static: false })
  dropdownIconAsset_type!: ElementRef<HTMLDivElement>;
  @ViewChild('dropdownIconRooms', { static: false })
  dropdownIconRooms!: ElementRef<HTMLDivElement>;
  AirDirections = [1, 2, 3, 4];
  ShowerRooms = [1, 2, 3, 4];
  viewOptions: string[] = ['ללא', 'לים', 'לפארק', 'לעיר'];
  roomsOptions: string[] = [
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
    '12.5',
  ];

  constructor(private renderer: Renderer2, private zone: NgZone) {
    afterNextRender(() => {
      document.body.addEventListener('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        if (
          clickedElement.classList.contains('dropdown-btn') ||
          clickedElement.classList.contains('dropdown-item')
        ) {
          return;
        }

        this.zone.run(() => {
          this.isAssetTypeDropdownHidden = false;
          this.isAssetAssetstateDropdownHidden = false;
          this.isRoomsDropdownHidden = false;
          this.rotateArrowAssetState('assetState');
          this.rotateArrowAssetType('assetType');
          this.rotateArrowRooms('rooms');
        });
      });
    });
  }

  assetTypes = [
    'דירה',
    'דירת גן',
    "בית פרטי/ קוטג'",
    'גג/ פנטהאוז',
    'מגרשים',
    'דופלקס',
    'תיירות ונופש',
    'דו משפחתי',
    'מרתף/ פרטר',
    'טריפלקס',
    'יחידת דיור',
    'משק חקלאי/ נחלה',
    'משק עזר',
    'דיור מוגן',
    'החלפת דירות',
    'סאבלט',
    'בניין מגורים (את הבניין כולו)',
    'סטודיו/ לופט',
    'מחסן',
    "קב' רכישה/ זכות לנכס",
    'חניה',
    'כללי',
  ];

  assetConditions = [
    'חדש מקבלן (לא גרו בו בכלל)',
    'חדש (נכס בן עד 10 שנים)',
    'משופץ (שופץ ב5 השנים האחרונות)',
    'במצב שמור (במצב טוב, לא שופץ)',
    'דרוש שיפוץ (זקוק לעבודת שיפוץ)',
  ];
  ngOnInit() {
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
      floor: [null],
      totalFloors: [null],
      onPillars: [false],
      neighborhood: ['', Validators.required],
      area: ['', Validators.required],
      assetState: ['', Validators.required],
      airDirections: [1],
      view: [this.viewOptions[0], Validators.required],
      rearProperty: [false],
      rooms: ['', Validators.required],
      showerRooms: [this.ShowerRooms[0], Validators.required],
      privateParking: [null],
      hasPrivateParking: [false],
      hasBolcony: [false],
      hasImage: [false],
      hasPrice: [false],
      moshavOrKibutz: [false],
      priceDiscount: [false],
      publisherIsMiddleMan: [false],
      publisherIsContractor: [false],
      balconiesNumber: [null],
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
      numberOfPayments: [null],
      houseCommitteePayment: [null],
      municipalityMonthlyPropertyTax: [null],
      builtSquareMeters: [null],
      gardenSquareMeters: [null],
      totalSquareMeters: [null],
      price: [null, Validators.required],
      minimumAmount: [null],
      pricePerMeter: [null],
      entryDate: ['', Validators.required],
      immediate: [false],
      flexible: [false],
      longTerm: [false],
      pictures: [[]], // Assuming an array of Picture type
      video: [''],
      contactName: [
        this.authService.user.getValue()?.name || '',
        Validators.required,
      ],
      contactPhone: [
        this.authService.user.getValue()?.phoneNumber || '',
        Validators.required,
      ],
      standardizationAccepted: [false],
    });
  }
  checkFormValidation() {
    for (const controlName in this.advertisementForm.controls) {
      if (this.advertisementForm.controls.hasOwnProperty(controlName)) {
        const control = this.advertisementForm.get(controlName);
        if (control && !control.valid) {
          console.error(`${controlName} is invalid`, control.errors);
        }
      }
    }
  }

  selectAirDirections(direction: number) {
    this.advertisementForm.get('airDirections').setValue(direction);
  }

  selectShowerRooms(rooms: number) {
    this.advertisementForm.get('showerRooms').setValue(rooms);
  }

  selectAirView(view: string) {
    this.advertisementForm.get('view').setValue(view);
  }

  optionClass(option: number): string {
    switch (option) {
      case 0:
        return 'option border-option-right';

      case 3:
        return 'option border-option-left';
      default:
        return 'option';
    }
  }

  changeTradeTypeTitle(): string {
    switch (this.advertisementForm.get('tradeType').value) {
      case 'מכירה':
        return 'אני רוצה למכור נכס';
      case 'השכרה':
        return 'אני רוצה להשכיר נכס';
      default:
        return '   ?מה נפרסם היום';
    }
  }

  onFileChange(event: any) {
    let file = event.target.files[0];
    this.images.push(file);
  }

  onFileVideoChange(event: any) {
    let file = event.target.files[0];
    this.video = file;
  }
  src(image: any) {
    return URL.createObjectURL(image);
  }
  async uploadAllImages() {
    if (this.images.length === 0) return [];
    const tasks = this.images.map((image) => {
      return this.imageService.uploadImage(image);
    });
    return await Promise.all(tasks).then((urls) => {
      return urls.map((u) => u.fileUrl);
    });
  }
  async uploadVideo() {
    if (!this.video) return '';
    return await this.imageService
      .uploadImage(this.video)
      .then((u) => u.fileUrl);
  }
  async handleSubmit() {
    if (!this.asset_type || !this.asset_State) {
      // alert('Asset type is required');
      return;
    }

    this.defineAssetState();
    const form = this.advertisementForm.value;
    form.assetType = this.asset_type;
    form.assetState = this.asset_State;
    try {
      const uploadedImages = await this.uploadAllImages();
      const video = await this.uploadVideo();
      form.pictures = uploadedImages;
      form.video = video;
      this.authService.postNewAdvertisement(form);
      if (this.advertisementForm.valid) {
      } else {
        this.checkFormValidation();
      }
    } catch (error) {
      console.error('Failed to submit advertisement', error);
    }
  }

  private defineAssetState() {
    switch (this.asset_State) {
      case 'חדש מקבלן (לא גרו בו בכלל)':
        this.advertisementForm.get('isNewFromBuilder').setValue(true);
        break;
      case 'חדש (נכס בן עד 10 שנים)':
        this.advertisementForm.get('isNew').setValue(true);
        break;
      case 'משופץ (שופץ ב5 השנים האחרונות)':
        this.advertisementForm.get('isRenovated').setValue(true);
        break;
      case 'במצב שמור (במצב טוב, לא שופץ)':
        this.advertisementForm.get('isWellMaintained').setValue(true);
        break;
      case 'דרוש שיפוץ (זקוק לעבודת שיפוץ)':
        this.advertisementForm.get('needsRenovation').setValue(true);
        break;
    }
  }

  isActive(type: string): boolean {
    return this.advertisementForm.get('tradeType').value === type;
  }
  setAdvertisementType(type: string) {
    this.advertisementForm.get('tradeType').setValue(type);
  }

  toggleDropdown(type: string): void {
    this.openAndCloseButtons(type);

    this.rotateArrowAssetType(type);
    this.rotateArrowAssetState(type);
  }

  private rotateArrowAssetType(type: string) {
    if (type === 'assetType') {
      if (this.isAssetTypeDropdownHidden) {
        this.renderer.addClass(
          this.dropdownIconAsset_type.nativeElement,
          'rotate-icon'
        );
      } else if ('assetState') {
        this.renderer.removeClass(
          this.dropdownIconAsset_type.nativeElement,
          'rotate-icon'
        );
      }
    }
  }

  private rotateArrowRooms(type: string) {
    if (type === 'rooms') {
      if (this.isRoomsDropdownHidden) {
        this.renderer.addClass(
          this.dropdownIconRooms.nativeElement,
          'rotate-icon'
        );
      } else {
        this.renderer.removeClass(
          this.dropdownIconRooms.nativeElement,
          'rotate-icon'
        );
      }
    }
  }

  private rotateArrowAssetState(type: string) {
    if (type === 'assetState') {
      if (this.isAssetAssetstateDropdownHidden) {
        this.renderer.addClass(
          this.dropdownIconAsset_State.nativeElement,
          'rotate-icon'
        );
      } else {
        this.renderer.removeClass(
          this.dropdownIconAsset_State.nativeElement,
          'rotate-icon'
        );
      }
    }
  }

  private openAndCloseButtons(type: string) {
    if (type === 'assetType') {
      this.isAssetTypeDropdownHidden = !this.isAssetTypeDropdownHidden;
      this.isAssetAssetstateDropdownHidden = false;
      this.rotateArrowAssetType('assetType');
      this.rotateArrowAssetState('assetState');
    } else if (type === 'assetState') {
      this.isAssetAssetstateDropdownHidden =
        !this.isAssetAssetstateDropdownHidden;
      this.isAssetTypeDropdownHidden = false;
      this.rotateArrowAssetType('assetType');
      this.rotateArrowAssetState('assetState');
    } else if (type === 'rooms') {
      this.isRoomsDropdownHidden = !this.isRoomsDropdownHidden;
      this.rotateArrowRooms('rooms');
    }
  }

  selectOption(option: string, type: string) {
    this.openAndCloseButtons(type);
    if (type === 'assetType') {
      this.asset_type = option;
    } else if (type === 'assetState') {
      this.asset_State = option;
    } else if (type === 'rooms') {
      this.asset_Rooms = option;
    }
  }
}
