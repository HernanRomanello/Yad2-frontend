import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
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
export class CreateNewAdvertisementComponent implements OnInit, OnDestroy {
  advertisementForm!: FormGroup | any;
  asset_type: string | undefined = undefined;
  asset_State: string | undefined = undefined;
  asset_Rooms: string | undefined = undefined;
  asset_owner: string = '';
  number_Of_Payments: string = 'לא בחר';
  hasImage: boolean = false;
  has2Contacts: boolean = false;
  mainImage: File | undefined = undefined;
  images: File[] = [];
  vidoeUrl: string = '';
  imagesUrl: string[] = [];
  video: File | undefined = undefined;
  authService = inject(AuthService);
  imageService = inject(ImageuploadService);
  formBuilder = inject(FormBuilder);
  isAssetTypeDropdownHidden = false;
  isNumberOfPaymentsTypeDropdownHidden = false;
  isAssetAssetstateDropdownHidden = false;
  isAssetAssetOwnerDropdownHidden = false;
  isRoomsDropdownHidden = false;
  descriptionMessage = 'הידעת: מודעה ללא תיאור, כמעט ולא מקבלת שיחות';
  minPrice = 0;
  averagePrice = 0;
  hoverColors: string[] = ['#000000', '#000000', '#000000', '#000000'];
  buttonsTypes: string[] = ['עסקים למכירה', 'נכס מסחרי', 'השכרה', 'מכירה'];
  isFormPagesHidden: boolean[] = [true, true, true, true, true, true, true];
  isFormPagesAreCompleted: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  @ViewChild('dropdownIconAsset_State', { static: false })
  dropdownIconAsset_State!: ElementRef;
  @ViewChild('dropdownIconAsset_type', { static: false })
  dropdownIconAsset_type!: ElementRef<HTMLDivElement>;
  @ViewChild('dropdownIconRooms', { static: false })
  dropdownIconRooms!: ElementRef<HTMLDivElement>;

  @ViewChild('dropdownIconnumber_Of_Payments_type', { static: false })
  dropdownIconnumber_Of_Payments_type!: ElementRef<HTMLDivElement>;

  @ViewChild('dropdownIconasset_owner', { static: false })
  dropdownIconasset_owner!: ElementRef<HTMLDivElement>;

  AirDirections = [1, 2, 3, 4];
  ShowerRooms = [1, 2, 3, 4];
  privateParking = [0, 1, 2, 3];
  balconiesNumber = [0, 1, 2, 3, 4];
  viewOptions: string[] = ['ללא', 'לים', 'לפארק', 'לעיר'];
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
  furnitureDescription: boolean = false;
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
          this.isNumberOfPaymentsTypeDropdownHidden = false;
          this.isAssetAssetOwnerDropdownHidden = false;
          this.rotateArrowAssetState('assetState');
          this.rotateArrowAssetType('assetType');
          this.rotateArrowRooms('rooms');
          this.rotateArrowNumberOfPayments('numberOfPayments');
          this.rotateArrowAssetOwner('asset_owner');
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.authService.IsHeaderAndFooterOpen(true);
    this.authService.SetPageRender('');
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

  assetOwner = ['בעל הנכס', 'שוכר נוכחי', 'אחר'];
  ngOnInit() {
    this.authService.IsHeaderAndFooterOpen(false);
    this.authService.SetPageRender('create-new-advertisement');
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
      floor: [0],
      totalFloors: [0],
      onPillars: [false],
      neighborhood: ['', Validators.required],
      area: ['', Validators.required],
      assetType: ['', Validators.required],
      assetState: ['', Validators.required],
      airDirections: [1],
      view: [this.viewOptions[0], Validators.required],
      rearProperty: [false],
      rooms: ['', Validators.required],
      showerRooms: [this.ShowerRooms[0], Validators.required],
      privateParking: [this.privateParking[0]],
      hasPrivateParking: [false],
      hasBolcony: [false],
      hasImage: [false],
      hasPrice: [false],
      // moshavOrKibutz: [false],
      needsRenovation: [false],
      isWellMaintained: [false],
      isRenovated: [false],
      isNew: [false],
      // isNewFromBuilder: [false],

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
      pictures: [[]],
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

  changeColor(textLength: number): string {
    if (textLength > 0 && textLength < 8) {
      this.descriptionMessage = 'מרגיש לנו שהטקסט שכתבת קצר מידי';
      return 'red';
    } else if (textLength > 7 && textLength < 32) {
      this.descriptionMessage = 'יופי, המודעה הולכת לכיוון הנכון';
      return '#ff7100';
    } else if (textLength >= 32 && textLength < 104) {
      this.descriptionMessage = 'אוטוטו...';
      return '#fbaf02';
    } else if (textLength >= 104) {
      this.descriptionMessage = 'בול!';
      return '#43c671';
    } else {
      this.descriptionMessage = 'הידעת: מודעה ללא תיאור, כמעט ולא מקבלת שיחות';
      return '#363636';
    }
  }

  pricePerSquareMeter(): string {
    const price = this.advertisementForm.get('price').value;
    if (price > 1) {
      this.advertisementForm.get('hasPrice').setValue(true);
    } else {
      this.advertisementForm.get('hasPrice').setValue(false);
    }
    const totalSquareMeters =
      this.advertisementForm.get('totalSquareMeters').value;
    const averagePrice = price / totalSquareMeters;
    if (averagePrice >= 1) {
      this.advertisementForm.get('pricePerMeter').setValue(averagePrice);
    } else {
      this.advertisementForm.get('pricePerMeter').setValue(0);
    }

    if (isNaN(averagePrice) || averagePrice === Infinity || averagePrice <= 1) {
      return '';
    }

    return averagePrice.toString();
  }

  setDateForToday(checkBox: string): void {
    const today = new Date().toISOString().substring(0, 10);
    this.advertisementForm.get('entryDate').setValue(today);
    if (checkBox === 'flexible') {
      this.advertisementForm.get('immediate').setValue(false);
    }
    if (checkBox === 'immediate') {
      this.advertisementForm.get('flexible').setValue(false);
    }
  }

  changeColorIfSelected(propertyFeature: string): string {
    if (
      propertyFeature === 'לא בחר' ||
      propertyFeature === null ||
      propertyFeature === undefined
    ) {
      return '#FFFFFF';
    } else {
      return '#363636';
    }
  }

  changeWidth(textLength: number): string {
    if (textLength >= 100) {
      return '99.5%';
    }
    var groups = Math.floor(textLength / 4);
    var widthPercent = groups * 4;
    return widthPercent + '%';
  }

  changeRadius(textLength: number): string {
    if (textLength >= 103) {
      return '5px';
    }
    return '0px';
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

  selectPrivateParking(parking: number) {
    this.advertisementForm.get('privateParking').setValue(parking);
    if (this.advertisementForm.get('privateParking').value !== 0) {
      this.advertisementForm.get('hasPrivateParking').setValue(true);
    } else {
      this.advertisementForm.get('hasPrivateParking').setValue(false);
    }
  }

  selectBalconiesNumber(balconies: number) {
    this.advertisementForm.get('balconiesNumber').setValue(balconies);
    if (this.advertisementForm.get('balconiesNumber').value !== 0) {
      this.advertisementForm.get('hasBolcony').setValue(true);
    } else {
      this.advertisementForm.get('hasBolcony').setValue(false);
    }
  }

  selectAirView(view: string) {
    this.advertisementForm.get('view').setValue(view);
  }
  selectPropertyFeatures(index: number) {
    const propertyFeature = this.propertyFeaturesChecked[index];
    var currentValue = !this.advertisementForm.get(propertyFeature.key).value;
    this.advertisementForm.get(propertyFeature.key).setValue(currentValue);
    if (propertyFeature.key === 'furnished') {
      if (currentValue) {
        this.furnitureDescription = true;
      } else {
        this.furnitureDescription = false;
      }
    }

    this.advertisementForm
      .get('airConditioner')
      .setValue(this.advertisementForm.get('tornadoAirConditioner').value);
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
  updateDescription(description: string) {
    this.advertisementForm.get('description').setValue(description);
  }

  updatefurnitureDescription(description: string) {
    this.advertisementForm.get('furnituredescription').setValue(description);
  }

  changeTradeTypeTitle(): string {
    switch (this.advertisementForm.get('tradeType').value) {
      case 'מכירה':
        this.minPrice = 10000;
        return 'אני רוצה למכור נכס';
      case 'השכרה':
        this.minPrice = 100;

        return 'אני רוצה להשכיר נכס';
      default:
        return '   ?מה נפרסם היום';
    }
  }

  onFileChange(event: any) {
    let file = event.target.files[0];
    this.images.push(file);
    if (this.images.length > 0) {
      this.hasImage = true;
    } else {
      this.hasImage = false;
    }
  }

  onFileVideoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    this.video = file;

    const videoUrl = URL.createObjectURL(file);
    this.vidoeUrl = videoUrl;
  }
  src(image: any) {
    return URL.createObjectURL(image);
  }
  async uploadAllImages() {
    if (this.images.length === 0) return [];
    const tasks = this.images.map((image) => {
      if (this.images.length === 1) {
        this.mainImage = image;
      }
      return this.imageService.uploadImage(image);
    });
    // alert(tasks);
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
    this.defineAssetState();
    // alert(this.vidoeUrl);
    const form = this.advertisementForm.value;
    // alert(this.advertisementForm.get('assetType').value);

    try {
      form.assetState = this.asset_State;
      const uploadedImages = await this.uploadAllImages();
      const video = await this.uploadVideo();
      form.pictures = uploadedImages;
      form.video = video;

      this.advertisementForm.get('pictures').setValue(this.imagesUrl);
      this.advertisementForm.get('video').setValue(this.vidoeUrl);
      if (uploadedImages.length > 0) {
        this.advertisementForm.get('hasImage').setValue(true);
        this.imagesUrl = uploadedImages.map((image) => image);
      } else {
        this.advertisementForm.get('hasImage').setValue(false);
      }

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

  setAdvertisementType(type: string) {
    this.advertisementForm.get('tradeType').setValue(type);
  }

  onMouseOver(type: string) {
    this.buttonsTypes.forEach((buttonType, index) => {
      if (buttonType === type) {
        this.hoverColors[index] = '#ff5100';
      } else {
        this.hoverColors[index] = '#000000';
      }
    });
  }

  set_Number_Of_Payments(type: string) {
    this.advertisementForm.get('numberOfPayments').setValue(type);
  }
  set_assetState(type: string) {
    this.advertisementForm.get('assetState').setValue(type);
  }

  set_Number_Of_Rooms(type: string) {
    this.advertisementForm.get('rooms').setValue(type);
  }

  setAssetType(type: string) {
    this.advertisementForm.get('assetType').setValue(type);
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

  private rotateArrowNumberOfPayments(type: string) {
    if (type === 'numberOfPayments') {
      if (this.isNumberOfPaymentsTypeDropdownHidden) {
        this.renderer.addClass(
          this.dropdownIconnumber_Of_Payments_type.nativeElement,
          'rotate-icon'
        );
      } else {
        this.renderer.removeClass(
          this.dropdownIconnumber_Of_Payments_type.nativeElement,
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

  private rotateArrowAssetOwner(type: string) {
    if (type === 'asset_owner') {
      if (this.isAssetAssetOwnerDropdownHidden) {
        this.renderer.addClass(
          this.dropdownIconasset_owner.nativeElement,
          'rotate-icon'
        );
      } else {
        this.renderer.removeClass(
          this.dropdownIconasset_owner.nativeElement,
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
    } else if (type === 'numberOfPayments') {
      this.isNumberOfPaymentsTypeDropdownHidden =
        !this.isNumberOfPaymentsTypeDropdownHidden;
      this.rotateArrowNumberOfPayments('numberOfPayments');
    } else if (type === 'asset_owner') {
      this.isAssetAssetOwnerDropdownHidden =
        !this.isAssetAssetOwnerDropdownHidden;
      this.rotateArrowAssetOwner('asset_owner');
    }
  }

  selectOption(option: string, type: string) {
    this.openAndCloseButtons(type);
    if (type === 'assetType') {
      this.asset_type = option;
      this.setAssetType(option);
    } else if (type === 'assetState') {
      this.asset_State = option;
      this.set_assetState(option);
    } else if (type === 'rooms') {
      this.asset_Rooms = option;
      this.set_Number_Of_Rooms(option);
    } else if (type === 'numberOfPayments') {
      this.number_Of_Payments = option;
      this.set_Number_Of_Payments(option);
    } else if (type === 'asset_owner') {
      this.asset_owner = option;
    }
  }

  getColor(option: string) {
    if (option === '') {
      return '0.6';
    } else {
      return '1';
    }
  }

  Definecontacts(numberOfContacts: number) {
    if (numberOfContacts === 2) {
      this.has2Contacts = true;
    } else {
      this.has2Contacts = false;
    }
  }

  submitPartOfTheForm(formPageNumber: number) {
    this.updateIfFormPartCompleted(formPageNumber);

    this.scrollToFormPart(formPageNumber);
  }

  private updateIfFormPartCompleted(formPageNumber: number) {
    this.isFormPagesAreCompleted[formPageNumber] = true;
    this.isFormPagesHidden[formPageNumber] = true;
    this.isFormPagesHidden[formPageNumber + 1] = false;
  }

  ReturnToPrevFormPart(formPageNumber: number) {
    this.openToEditFormPart(formPageNumber - 1);
    this.scrollToFormPart(formPageNumber - 1);
  }

  openToEditFormPart(formPageNumber: number) {
    if (this.isFormPagesAreCompleted[formPageNumber]) {
      this.isFormPagesHidden.forEach((value, index) => {
        this.isFormPagesHidden[index] = true;
      });
      this.isFormPagesHidden[formPageNumber] = false;
      this.isFormPagesAreCompleted[formPageNumber] = false;
    }
  }

  continueToTheNextFormPage(formPageNumber: number) {
    if (true) {
      // this.updateIfFormPartCompleted(formPageNumber);
      // this.openToEditFormPart(formPageNumber + 1);
      // this.scrollToFormPart(formPageNumber + 1);
      this.updateIfFormPartCompleted(formPageNumber);
      this.continueToTheNextFormPage(formPageNumber);
    }
  }

  checkTheFormPartIfIsValid(formPageNumber: number) {
    if (this.checkIfThisFormPartIsValid(formPageNumber)) {
      this.updateIfFormPartCompleted(formPageNumber);
      this.continueToTheNextFormPage(formPageNumber);
    }
  }

  checkIfThisFormPartIsValid(formPageNumber: number) {
    switch (formPageNumber) {
      case 1: {
        return (
          this.advertisementForm.get('city').valid &&
          this.advertisementForm.get('street').valid &&
          this.advertisementForm.get('number').valid &&
          this.advertisementForm.get('floor').valid &&
          this.advertisementForm.get('totalFloors').valid &&
          this.advertisementForm.get('neighborhood').valid &&
          this.advertisementForm.get('area').valid &&
          this.advertisementForm.get('assetType').valid &&
          this.advertisementForm.get('assetState').valid
        );
      }
      case 2: {
        return this.advertisementForm.get('rooms').valid;
      }
      case 3: {
        return (
          this.advertisementForm.get('entryDate').valid &&
          this.advertisementForm.get('totalSquareMeters').valid
        );
      }
      case 4: {
        return true;
      }
      case 5: {
        return (
          this.advertisementForm.get('contactName').valid &&
          this.advertisementForm.get('contactPhone').valid &&
          this.advertisementForm.get('standardizationAccepted').valid
        );
      }
    }
  }

  private scrollToFormPart(formPageNumber: number) {
    if (this.isFormPagesAreCompleted[formPageNumber]) {
      setTimeout(() => {
        const nextSection = document.getElementById(
          `Selection-${formPageNumber + 2}`
        );
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }
}
