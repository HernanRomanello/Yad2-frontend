import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { ImageuploadService } from '../../services/imageupload.service';
import { ModalStateService } from '../../services/modal-state.service';
import { Router } from '@angular/router';
import { AdvertisementService } from '../../services/advertisement.service';
import { InputsStyleService } from '../../services/inputs-style.service';
import {
  City,
  CityListService,
  Street,
} from '../../services/city-list.service';
import { NavigationService } from '../../services/navigation.service';
import { last } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-create-new-advertisement',
  templateUrl: './create-new-advertisement.component.html',
  styleUrl: './create-new-advertisement.component.css',
})
export class CreateNewAdvertisementComponent implements OnInit, OnDestroy {
  advertisementForm!: FormGroup | any;
  $cities: City[] = [];
  $streets: Street[] = [];
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
  navigationService = inject(NavigationService);
  isAssetTypeDropdownHidden = false;
  isNumberOfPaymentsTypeDropdownHidden = false;
  isCityDropdownHidden = true;
  isStreetDropdownHidden = true;
  isAssetAssetstateDropdownHidden = false;
  isAssetAssetOwnerDropdownHidden = false;
  isRoomsDropdownHidden = false;
  descriptionMessage = 'הידעת: מודעה ללא תיאור, כמעט ולא מקבלת שיחות';
  minPrice = 0;
  averagePrice = 0;
  hoverColors: string[] = ['#000000', '#000000', '#000000', '#000000'];
  ClickBorderColors: string[] = ['#cccccc', '#cccccc', '#cccccc', '#cccccc'];
  buttonsTypes: string[] = ['עסקים למכירה', 'נכס מסחרי', 'השכרה', 'מכירה'];
  chosenTradeType: string = '';
  isFormHasvalidStreetAddress: boolean = false;
  isFormHasvalidCityAddress: boolean = false;
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
  isFormPagesAreSubmitted: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  router = inject(Router);
  advertisementService = inject(AdvertisementService);
  inputsStyleService = inject(InputsStyleService);
  cityListService = inject(CityListService);

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

  areas: any[] = [];
  errorMessage: string | null = null;
  constructor(
    private renderer: Renderer2,
    private modalstate: ModalStateService
  ) {}

  setCity(city: string) {
    this.checkIfValidCity(city);
    this.advertisementForm.get('city').setValue(city);
    this.isCityDropdownHidden = true;
  }

  HideCityAndStreetDropdown(event: any) {
    const elememt = event.target as HTMLElement;
    if (
      !elememt.classList.contains('city-Input') &&
      !elememt.classList.contains('street-Input')
    ) {
      this.isCityDropdownHidden = true;
      this.isStreetDropdownHidden = true;
    }
  }

  closeDropdownSection2(event: any) {
    const elememt = event.target as HTMLElement;
    if (this.isAssetTypeDropdownHidden) {
      this.isAssetAssetstateDropdownHidden = false;
    }
    if (this.isAssetAssetstateDropdownHidden) {
      this.isAssetTypeDropdownHidden = false;
    }

    if (!elememt.classList.contains('dropdown-btn')) {
      this.isAssetTypeDropdownHidden = false;
      this.isAssetAssetstateDropdownHidden = false;
    }
  }
  closeDropdownSection3(event: any) {
    const elememt = event.target as HTMLElement;
    if (!elememt.classList.contains('dropdown-btn')) {
      this.isRoomsDropdownHidden = false;
    }
    if (elememt.classList.contains('rotate-icon')) {
      this.isRoomsDropdownHidden = !this.isRoomsDropdownHidden;
    }
  }
  closeDropdownSection6(event: any) {
    const elememt = event.target as HTMLElement;
    if (
      !elememt.classList.contains('rotate-icon') &&
      !elememt.classList.contains('dropdown-btn')
    ) {
      this.isAssetAssetOwnerDropdownHidden = false;
    }
  }
  closeDropdownSection4(event: any) {
    const elememt = event.target as HTMLElement;

    if (
      !elememt.classList.contains('rotate-icon') &&
      !elememt.classList.contains('dropdown-btn')
    ) {
      this.isNumberOfPaymentsTypeDropdownHidden = false;
    }
  }

  ngOnDestroy(): void {
    this.navigationService.isalternativeHeaderISOpen(false);
    this.navigationService.IsHeaderAndFooterOpen(true, true);
    this.navigationService.isCreateNewAdIsOpen.set(false);

    this.authService.SetPageRender('');
  }

  eraseInputValue(id: string, event: any, inputValid: boolean): void {
    if (inputValid === true) {
      if (event.key === 'Backspace') {
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) {
          input.value = '';
          this.isFormHasvalidCityAddress = false;
        }
      }
    }
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

  assetOwner = ['בעל הנכס', 'שוכר נוכחי', 'אחר'];
  ngOnInit() {
    this.navigationService.isalternativeHeaderISOpen(true);
    this.navigationService.isCreateNewAdIsOpen.set(true);
    this.navigationService.IsHeaderAndFooterOpen(true, false);
    this.authService.SetPageRender('create-new-advertisement');
    this.advertisementForm = this.formBuilder.group({
      city: ['', [Validators.required, this.isValidCityName.bind(this)]],
      tradeType: ['', Validators.required],
      street: [, [Validators.required, this.isValidStreetName.bind(this)]],
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
      assetState: ['', Validators.required],
      airDirections: [1],
      view: [this.advertisementService.viewOptions[0], Validators.required],
      rearProperty: [false],
      rooms: ['', Validators.required],
      showerRooms: [
        this.advertisementService.ShowerRooms[0],
        Validators.required,
      ],
      privateParking: [this.advertisementService.privateParking[0]],
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

    this.cityListService.getCityList().subscribe((cities) => {
      this.$cities = cities;
    });
    this.cityListService.getStreetList().subscribe((streets) => {
      this.$streets = streets;
    });
  }

  checkIfValidCity(city: string): void {
    const CityName = city;

    const validCity = this.$cities.find(
      (city: City) => city.city_name_he === CityName
    );

    this.isFormHasvalidCityAddress = validCity ? true : false;
  }
  checkIfValidStreet(Street: string): void {
    const streetName = Street;

    const validstreet = this.$streets.find(
      (street: Street) =>
        street.Street_Name === streetName &&
        street.City_Name === this.advertisementForm.get('city').value
    );

    this.isFormHasvalidStreetAddress = validstreet ? true : false;
  }

  isValidStreetName(): ValidationErrors | null {
    const ValidStreetName = this.isFormHasvalidStreetAddress;

    return ValidStreetName === true ? null : { invalidStreetName: true };
  }
  isValidCityName(): ValidationErrors | null {
    const validCity = this.isFormHasvalidCityAddress;
    return validCity === true ? null : { invalidCityName: null };
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

  checkIfFloorNumberValid(floor: string, totalFloors: string): void {
    const floorNum = parseInt(floor, 10);
    const totalFloorsNum = parseInt(totalFloors, 10);

    if (
      !isNaN(floorNum) &&
      !isNaN(totalFloorsNum) &&
      floorNum > totalFloorsNum
    ) {
      this.advertisementForm.get('totalFloors').setValue(floor);
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
    const propertyFeature =
      this.advertisementService.propertyFeaturesChecked[index];
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

  optionClass(option: number, length: number): string {
    const lastOptionIndex = length;

    if (option === lastOptionIndex - 1) {
      return 'option border-option-left border-right-none';
    } else if (option === 0) {
      return 'option border-option-right';
    } else {
      return 'option border-right-none';
    }
  }

  removeBorederIfNeed(
    option: number,
    selected: number,
    event: any,
    words: boolean
  ) {
    const elememt = event.target as HTMLElement;
    if (
      event.target.classList.contains('selected1') ||
      event.target.classList.contains('selected')
    ) {
      return;
    }

    if (words) {
      return;
    }
    if (option === selected) {
      this.renderer.addClass(elememt, 'border-right-none1');
    }
    if (option === selected - 2) {
      this.renderer.addClass(elememt, 'border-left-none1');
    }
  }
  addBorederIfNeed(event: any) {
    const elememt = event.target as HTMLElement;
    this.renderer.removeClass(elememt, 'border-right-none1');
    this.renderer.removeClass(elememt, 'border-left-none1');
  }
  updateDescription(description: string) {
    this.advertisementForm.get('description').setValue(description);
  }

  updatefurnitureDescription(description: string) {
    this.advertisementForm.get('furnituredescription').setValue(description);
  }
  isActive(type: string): void {
    this.chosenTradeType = type;
    this.buttonsTypes.forEach((buttonType, index) => {
      if (buttonType === this.chosenTradeType) {
        this.hoverColors[index] = '#ff7100';
        this.ClickBorderColors[index] = '#ff7100';
      } else {
        this.hoverColors[index] = '#000000';
        this.ClickBorderColors[index] = '#cccccc';
      }
    });
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
    if (this.images.length >= 10) {
      return;
    }
    let file = event.target.files[0];
    this.images.push(file);
    if (this.images.length > 0) {
      this.hasImage = true;
    } else {
      this.hasImage = false;
    }
  }

  clickOnImageInput() {
    const input = document.getElementById(
      'upload-img-input'
    ) as HTMLInputElement;
    input.click();
  }

  removeFileChange(index: number) {
    this.images.splice(index, 1);
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

    //hernan

    console.log('video', file.name);

    this.vidoeUrl = environment.URl + 'uploads/' + file.name;

    this.imageService.uploadImage(file);
  }

  async uploadAllImages() {
    if (this.images.length === 0) return [];

    const tasks = this.images.map((image) => {
      if (this.images.length === 1) {
        this.mainImage = image;
      }

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
    this.defineAssetState();
    const cityControl = this.advertisementForm.get('city');
    if (cityControl) {
      cityControl.setErrors({ invalid: true });
      cityControl.markAsTouched();
    }
    const form = this.advertisementForm.value;

    try {
      form.assetState = this.asset_State;
      const uploadedImages = await this.uploadAllImages();
      // const video = await this.uploadVideo();
      form.pictures = uploadedImages;
      form.video = this.vidoeUrl;

      this.advertisementForm.get('pictures').setValue(this.imagesUrl);
      this.advertisementForm.get('video').setValue(this.vidoeUrl);
      if (uploadedImages.length > 0) {
        this.advertisementForm.get('hasImage').setValue(true);
        this.imagesUrl = uploadedImages.map((image) => image);
      } else {
        this.advertisementForm.get('hasImage').setValue(false);
      }

      this.authService.postNewAdvertisement(form);
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
      const ActiveIndex = this.buttonsTypes.indexOf(this.chosenTradeType);
      if (buttonType === type) {
        this.hoverColors[index] = '#ff7100';
      } else if (index !== ActiveIndex) {
        this.hoverColors[index] = '#000000';
      }
    });
  }

  showOrHideModal(isVisible: boolean) {
    this.modalstate.isModalVisible.next(isVisible);
  }

  selectOption(option: string, type: string) {
    if (type === 'assetType') {
      this.asset_type = option;
      this.advertisementForm.get('assetType').setValue(option);
    } else if (type === 'assetState') {
      this.asset_State = option;
      this.advertisementForm.get('assetState').setValue(option);
    } else if (type === 'rooms') {
      this.asset_Rooms = option;
      this.advertisementForm.get('rooms').setValue(option);
    } else if (type === 'numberOfPayments') {
      this.number_Of_Payments = option;
      this.advertisementForm.get('numberOfPayments').setValue(option);
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
    this.has2Contacts = numberOfContacts === 2 ? true : false;
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
    this.isFormPagesAreSubmitted[formPageNumber - 1] = true;

    // if (this.checkIfThisFormPartIsValid(formPageNumber)) {
    this.updateIfFormPartCompleted(formPageNumber);
    this.continueToTheNextFormPage(formPageNumber);
    //hernan
    // }
  }

  checkIfThisFormPartIsValid(formPageNumber: number) {
    switch (formPageNumber) {
      case 1: {
        const mustFieldsInFormPart1 = [
          'city',
          'street',
          'floor',
          'totalFloors',
          'assetType',
          'assetState',
        ];

        return this.checkInputs(mustFieldsInFormPart1, true);
      }
      case 2: {
        const mustFieldsInFormPart2 = ['rooms'];
        return this.checkInputs(mustFieldsInFormPart2, true);
      }
      case 3: {
        const mustFieldsInFormPart3 = [
          'entryDate',
          'totalSquareMeters',
          'numberOfPayments',
        ];
        return this.checkInputs(mustFieldsInFormPart3, true);
      }

      case 5: {
        const mustFieldsInFormPart5 = [
          'contactName',
          'contactPhone',
          'standardizationAccepted',
        ];

        const errorStandardizationAccepted = document.getElementById(
          'standardizationAccepted-error'
        );
        if (errorStandardizationAccepted) {
          if (
            this.advertisementForm.get('standardizationAccepted').value ===
            false
          ) {
            errorStandardizationAccepted.classList.add('display-block');
          } else {
            errorStandardizationAccepted.classList.remove('display-block');
          }
        }
        return this.checkInputs(mustFieldsInFormPart5, true);
      }
      default: {
        return true;
      }
    }
  }

  checkInputs(mustFieldsInFormPart1: string[], validForm: boolean) {
    for (const field of mustFieldsInFormPart1) {
      const fieldControl = this.advertisementForm.get(field);
      const element = document.getElementById(field);
      const elementErrorText = document.getElementById(`${field}-error`);

      if (!(field === 'city' || field === 'street')) {
        validForm = this.markErrorIfInvalidInput(
          fieldControl,
          element,
          elementErrorText,
          validForm
        );
      } else {
        if (
          (this.isFormHasvalidCityAddress === true && field === 'city') ||
          this.isFormHasvalidStreetAddress === true
        ) {
          this.removeRedBorder(element, elementErrorText);
          if (this.isFormHasvalidCityAddress === false && field === 'city') {
            validForm = this.markRedBorder(
              element,
              elementErrorText,
              validForm
            );
          }
        } else {
          validForm = this.markRedBorder(element, elementErrorText, validForm);
        }
      }
    }
    return validForm;
  }

  private markErrorIfInvalidInput(
    fieldControl: any,
    element: HTMLElement | null,
    elementErrorText: HTMLElement | null,
    validForm: boolean
  ) {
    if (!fieldControl.valid) {
      validForm = this.markRedBorder(element, elementErrorText, validForm);
    } else {
      this.removeRedBorder(element, elementErrorText);
    }
    return validForm;
  }

  private removeRedBorder(
    element: HTMLElement | null,
    elementErrorText: HTMLElement | null
  ) {
    if (element && elementErrorText) {
      element.classList.remove('border-invalid');
      elementErrorText.classList.remove('display-block');
    }
  }

  private markRedBorder(
    element: HTMLElement | null,
    elementErrorText: HTMLElement | null,
    validForm: boolean
  ) {
    if (element && elementErrorText) {
      element.classList.add('border-invalid');
      elementErrorText.classList.add('display-block');
      validForm = false;
    }
    return validForm;
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
