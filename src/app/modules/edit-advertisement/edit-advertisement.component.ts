import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvertisementService } from '../../services/advertisement.service';
import { catchError } from 'rxjs';
import { InputsStyleService } from '../../services/inputs-style.service';
import { ImageuploadService } from '../../services/imageupload.service';
import { environment } from '../../../environments/environment.development';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-edit-advertisement',
  templateUrl: './edit-advertisement.component.html',
  styleUrls: [
    './edit-advertisement.component.css',
    '../create-new-advertisement/create-new-advertisement.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EditAdvertisementComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked
{
  advertisement!: AdvertisementsModel;
  isAssetAssetstateDropdownHidden = true;
  isNumberOfPaymentsDropdownHidden = true;
  asset_State = '';
  houseNumber: string = '';
  images: File[] = [];
  imagesURLs: string[] = [];
  imagesURLsForPosting: string[] = [];
  imagesURlWasDeleted: boolean[] = [];
  videoURL: string = '';
  mainImageURLwasDeleted: boolean = false;
  ImagesThatCanEdit: boolean[] = [];
  numberValuesForForm: (string | number)[] = new Array(5);
  mainImage: File | undefined = undefined;
  mainImageURL: string = '';
  Url = environment.URl;
  video: File | undefined = undefined;
  videoWasDeleted: boolean = false;
  isHouseNumberEraseBtnHidden = true;
  isTotalFloorsEraseBtnHidden = true;
  isBuiltSquareMetersEraseBtnHidden = true;
  isFurnitureDescriptionEraseBtnHidden = true;
  isDescriptionEraseBtnHidden = true;
  isPriceEraseBtnHidden = true;
  isTotalSquareMetersEraseBtnHidden = true;
  isMunicipalityMonthlyPropertyTaxEraseBtnHidden = true;
  isHouseCommitteePaymentEraseBtnHidden = true;
  iscontactNameEraseBtnHidden = false;
  isSecondcontactNameEraseBtnHidden = true;
  isassetOwnerDropdownHidden = true;
  apostrophe = '"';
  calendarIsdisabled = false;
  has2Contacts = false;
  @ViewChild('entryDate', { static: false })
  entryDate!: ElementRef<HTMLDivElement>;
  @ViewChild('scoreBar', { static: false })
  scoreBar!: ElementRef<HTMLDivElement>;
  assetOwner = ['בחר', 'בעל הנכס', 'שוכר נוכחי', 'אחר'];
  asset_Owner = this.assetOwner[0];
  userEmailAddress = '';
  secondContactName = '';
  secondContactPhone = '';
  addScore: number = 0;
  cityList: any;
  scoreBarwidthInPixels: number = 0;
  propertyFeaturesImages: string[] = [
    'cold-svgrepo-com',
    'cube-escape-svgrepo-com',
    'inventory_2',
    'drawers-svgrepo-com',
    'accessibility-svgrepo-com',
    'elevator-svgrepo-com',
    'paint-svgrepo-com',
    'grid-svgrepo-com',
    'people-svgrepo-com',
    'dog-bold-svgrepo-com',
    'tap-faucet-svgrepo-com',
    'solar-battery-4-svgrepo-com',
    'sensor_door',
    'cold-svgrepo-com',
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

  propertyFeaturesChecked: { key: string; checked: boolean }[] = [
    { key: 'airConditioning', checked: false }, // מיזוג
    { key: 'safeRoom', checked: false }, // ממ"ד
    { key: 'storageRoom', checked: false }, // מחסן
    { key: 'furnished', checked: false }, // ריהוט
    { key: 'accessibleForDisabled', checked: false }, // גישה לנכים
    { key: 'elevator', checked: false }, // מעלית
    { key: 'renovated', checked: false }, // משופצת
    { key: 'windowBars', checked: false }, // סורגים
    { key: 'forRoommates', checked: false }, // לשותפים
    { key: 'petsAllowed', checked: false }, // חיות מחמד
    { key: 'kosherKitchen', checked: false }, // מטבח כשר
    { key: 'solarWaterHeater', checked: false }, // דוד שמש
    { key: 'multiLockDoors', checked: false }, // דלתות רב-בריח
    { key: 'tornadoAirConditioner', checked: false }, // מזגן טורנדו
  ];

  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  advertisementService = inject(AdvertisementService);
  inputsStyleService = inject(InputsStyleService);
  imageuploadService = inject(ImageuploadService);
  navigationService = inject(NavigationService);

  ngOnDestroy(): void {
    this.navigationService.isEditAdvertisementISOpen(false);
    this.navigationService.isalternativeHeaderISOpen(false);
    this.navigationService.isalternativeHeaderISOpen(false);
    this.navigationService.IsHeaderAndFooterOpen(true, true);
    this.authService.SetPageRender('');
    this.authService.user.unsubscribe();
  }

  ngAfterContentChecked(): void {
    this.imagesURLs.forEach((url, index) => {
      if (url !== '') {
        this.ImagesThatCanEdit[index] = true;
      }
    });
    this.calculateAdRank();
  }

  isNaN(value: string): boolean {
    return isNaN(parseInt(value));
  }

  calculateAdRank(): void {
    let adRank = 0;
    (
      Object.keys(this.advertisement) as Array<keyof AdvertisementsModel>
    ).forEach((key) => {
      const value = this.advertisement[key];

      if (
        value !== null &&
        value !== undefined &&
        typeof value !== 'boolean' &&
        value !== ''
      ) {
        if (typeof value === 'number' && !(value > 0)) {
          adRank += -1.8;
        }
        adRank += 1.5;
      }
    });
    this.imagesURLs.forEach((url) => {
      if (url !== '') {
        adRank += 9;
      }
    });
    adRank = parseFloat(adRank.toFixed(0));
    if (adRank > 100) {
      adRank = 100;
    }
    this.addScore = adRank;
  }

  constructor(render: Renderer2, private router: Router) {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const clickOutsdieDropdown =
        !target.classList.contains('dropdown-btn') ||
        target.classList.contains('input-container') ||
        target.classList.contains('advertisement') ||
        target.classList.contains('space-block') ||
        target.classList.contains('edit-container');

      if (clickOutsdieDropdown === true) {
        this.closeAllDropdowns();
      }
    });
    document.addEventListener('keyup', (event) => {
      const target = event.target as HTMLElement;
      this.formatNumbersInTheForm(target.id);
    });
  }
  ngAfterViewInit(): void {
    this.scoreBarwidthInPixels = this.scoreBar.nativeElement.offsetWidth;

    for (let index = 0; index < this.advertisement.pictures.length; index++) {
      this.imagesURLs.push(this.advertisement.pictures[index].url);
      this.imagesURLsForPosting.push(this.advertisement.pictures[index].url);
      this.ImagesThatCanEdit.push(true);
    }

    for (let index = 0; index <= 9; index++) {
      this.imagesURlWasDeleted.push(false);
      this.images.push(new File([''], ''));
      if (this.imagesURLs.length <= index) {
        this.imagesURLs.push('');
        this.imagesURLsForPosting.push('');
      }
      if (this.ImagesThatCanEdit.length <= index) {
        this.ImagesThatCanEdit.push(false);
      }
    }

    this.imagesURLsForPosting.push('');

    this.initialFormatNumberInForm();
  }

  openAndCloseDropdown(type: string, dropdownTypeWasClicked: boolean) {
    const dropdownTypeWasClickedState = dropdownTypeWasClicked;
    const dropdownTypeWasClickedNewState = !dropdownTypeWasClickedState;
    this.closeAllDropdowns();
    if (type === 'assetState') {
      this.isAssetAssetstateDropdownHidden = dropdownTypeWasClickedNewState;
    } else if (type === 'numberOfPayments') {
      this.isNumberOfPaymentsDropdownHidden = dropdownTypeWasClickedNewState;
    } else if (type === 'assetOwner') {
      this.isassetOwnerDropdownHidden = dropdownTypeWasClickedNewState;
    }
  }

  onFileChange(event: any, index: number, isMainImage: boolean): string | null {
    const file = event.target.files[0];

    if (!file) {
      return null;
    }

    this.images[index] = file;
    this.mainImage = file;

    //hernan

    this.advertisement.hasImage = this.images.length > 0;

    const fileURL = URL.createObjectURL(file);

    if (this.advertisement.pictures[index]) {
      this.advertisement.pictures[index].url = fileURL;
      this.imagesURLsForPosting[index] = this.Url + 'uploads/' + file.name;
      this.ImagesThatCanEdit[index] = true;
      this.imagesURlWasDeleted[index] = false;
    } else {
      this.advertisement.pictures[index] = {
        id: this.advertisement.id,
        advertisementId: this.advertisement.id,
        url: fileURL,
      };
    }

    if (isMainImage) {
      this.mainImageURL = this.Url + 'uploads/' + file.name;
      console.log('this.mainImageURL:', this.imagesURLs);
      console.log('this.mainImageURL:', this.mainImageURL);
      this.imageuploadService.uploadImage(file);

      if (this.mainImageURL) {
        URL.revokeObjectURL(this.imagesURLs[index]);
      }
      this.advertisement.mainPicture = this.mainImageURL;

      return this.mainImageURL;
    }

    if (this.imagesURLs[index]) {
      URL.revokeObjectURL(this.imagesURLs[index]);
    }

    this.imagesURLs[index] = fileURL;

    this.imageuploadService.uploadImage(file);

    this.imagesURLsForPosting[index] = this.Url + 'uploads/' + file.name;
    return fileURL;
  }

  uploadVideoFile(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.video = file;
    this.imageuploadService.uploadImage(file);
    this.videoURL = this.Url + 'uploads/' + file.name;
  }

  Definecontacts(numberOfContacts: number) {
    this.has2Contacts = numberOfContacts === 2 ? true : false;
  }

  changeImage(event: any, index: number) {
    const newImageUrl = this.onFileChange(event, index, index === 0);

    if (newImageUrl) {
      if (index === 0) {
        this.mainImageURL = newImageUrl;
        this.mainImageURLwasDeleted = false;
      } else {
        this.advertisement.pictures[index].url = newImageUrl;
      }
      // this.advertisement.pictures[index].url = newImageUrl;
    }

    this.imagesURlWasDeleted[index] = false;
  }

  hideImageOnHover(
    index: number,
    imageURL: string,
    imagesURlWasDeleted: boolean
  ) {
    if (index === 0 && !imagesURlWasDeleted) {
      this.mainImageURL = imageURL;
    }

    if (imagesURlWasDeleted === false) {
      this.imagesURLs[index] = imageURL;
    }
  }

  ngOnInit(): void {
    this.navigationService.isalternativeHeaderISOpen(true);
    this.navigationService.isEditAdvertisementISOpen(true);

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
            this.mainImageURL = this.advertisement.mainPicture;
            this.videoURL = this.advertisement.video;
          });
      }
    });
    this.authService.user.subscribe((user) => {
      if (user) {
        this.userEmailAddress = user.email;
      }
    });

    this.initialFormatNumberInForm();
  }

  deleteImage(index: number) {
    if (index === 0) {
      this.mainImageURLwasDeleted = true;
      this.mainImageURL = '';
    } else {
      this.imagesURlWasDeleted[index] = true;
      this.imagesURLs[index] = '';
    }
  }

  deleteVideo() {
    this.advertisement.video = '';
    this.videoURL = '';
    this.videoWasDeleted = true;
  }

  selectPropertyFeatures(index: number) {
    const propertyFeature = this.propertyFeaturesChecked[index];
    const currentValueIndex = propertyFeature.key;

    if (currentValueIndex in this.advertisement) {
      const currentValue = this.advertisement[
        currentValueIndex as keyof typeof this.advertisement
      ] as boolean;

      const updatedValue = !currentValue;
      (this.advertisement[
        currentValueIndex as keyof typeof this.advertisement
      ] as boolean) = updatedValue;
    }
  }

  formatNumbersInTheForm(id: string) {
    const AllNumbersInputsInForm = document.getElementById(id);
    const input = AllNumbersInputsInForm as HTMLInputElement;
    input.value = this.addCommasToNumber(input.value);
  }
  activateFocusById(id: string) {
    const input = document.getElementById(id) as HTMLInputElement;
    input.focus();
  }

  initialFormatNumberInForm() {
    this.formatNumbersInTheForm('houseCommitteePayment');
    this.formatNumbersInTheForm('municipalityMonthlyPropertyTax');
    this.formatNumbersInTheForm('totalSquareMeters');
    this.formatNumbersInTheForm('price');
  }

  addCommasToNumber(num: string): string {
    if (!/^\d+$/.test(num)) {
      return num;
    }

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  setDateForToday(checkBox: string): void {
    const today = new Date().toISOString().substring(0, 10);
    this.advertisement.entryDate = today;
    if (checkBox === 'flexible') {
      if (this.entryDate) {
        this.entryDate.nativeElement.style.opacity = '0.5';
        (this.entryDate.nativeElement as HTMLInputElement).disabled = true;
      }
    }
    if (checkBox === 'immediate') {
      this.entryDate.nativeElement.style.opacity = '0.5';
    }
  }

  disableCalendar(input1: boolean, input2: boolean) {
    if (input1 === true || input2 === true) {
      this.calendarIsdisabled = true;
      this.calendarIsdisabled = false;
    }
  }

  formatDateString(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  toDateString(date: string): string {
    const [year, month, day] = date.split('-').map(Number);

    const newDate = new Date(year, month - 1, +(day + 1));

    const formattedDateString =
      newDate.toISOString().split('T')[0] + 'T00:00:00.0';

    return formattedDateString;
  }

  async uploadAllImages() {
    if (this.images.length === 0) return [];

    const validImages = this.images.filter((image) => image.size > 0);

    if (validImages.length === 0) return [];

    const tasks = validImages.map((image) => {
      if (validImages.length === 1) {
        this.mainImage = image;
      }

      return this.imageuploadService.uploadImage(image);
    });

    return await Promise.all(tasks).then((urls) => {
      return urls.map((u) => u.fileUrl);
    });
  }

  removeCommasFromNumberAndParseInt(value: string): number {
    return parseFloat(value.replace(/,/g, ''));
  }
  changeColor(textLength: number): string {
    let className = 'fill-loading-bar';

    switch (true) {
      case textLength <= 1:
        className = 'fill-loading-bar';
        break;

      case textLength > 0 && textLength <= 30:
        className = 'red-gradient fill-loading-bar';
        break;

      case textLength > 30 && textLength <= 60:
        className = 'dark-yellow-gradient fill-loading-bar';
        break;

      case textLength > 60 && textLength <= 100:
        className = 'yellow-gradient fill-loading-bar';
        break;

      case textLength >= 100 && textLength <= 130:
        className = 'light-yellow-gradient fill-loading-bar';
        break;

      case textLength >= 130:
        className = 'green-gradient fill-loading-bar';
        break;

      default:
        className = 'fill-loading-bar';
        break;
    }

    return className;
  }

  defineScoreBArColor(): string {
    let className = 'ad-score-pink-gradient';

    switch (true) {
      case this.addScore <= 50:
      default:
        className = 'ad-score-pink-gradient';
        break;

      case this.addScore > 50 && this.addScore <= 75:
        className = 'ad-score-yellow-gradient';
        break;

      case this.addScore > 75:
        className = 'ad-score-green-gradient';
        break;
    }

    return className;
  }

  createSuggestionToImproveAd(): string {
    if (!(this.advertisement.price > 0)) {
      return 'טיפ שלנו - שווה לך להכניס מחיר.';
    }
    const Images = (): number => {
      const validURLs = this.imagesURLs?.filter((url) => url !== '') || [];
      return validURLs.length;
    };

    if (Images() < 3) {
      return 'טיפ שלנו - שווה לך להוסיף עוד תמונה.';
    }

    return 'עכשיו הסיכויים שלך למכור את המוצר, גבוהים מאוד.';
  }

  testIfIsValidNumber(value: string): boolean {
    return /^\d+$/.test(value);
  }

  async handleSubmit() {
    try {
      var ImagesURLsForPosting = this.imagesURLs.filter((url) => url !== '');

      if (this.mainImageURLwasDeleted && this.imagesURLs.length > 0) {
        const newMainImageURL = this.imagesURLs.find((url) => url !== '');

        if (newMainImageURL) {
          this.advertisement.mainPicture = newMainImageURL;
          this.mainImageURL = newMainImageURL;
          this.mainImageURLwasDeleted = false;

          this.imagesURLs.splice(this.imagesURLs.indexOf(newMainImageURL), 1);
        }
      }

      if (this.advertisement.pictures.length > 0) {
        this.advertisement.hasImage = true;
        this.advertisement.pictures = this.imagesURLs.map((url) => ({
          id: this.advertisement.id,
          advertisementId: this.advertisement.id,
          url: url,
        }));
      } else {
        this.advertisement.hasImage = false;
      }
      this.advertisement.video = this.videoURL;
      this.advertisementService.updateAdvertisement(
        this.advertisement,
        this.advertisement.id,
        ImagesURLsForPosting
      );

      this.router.navigate(['/profile/user-advertisement']);
    } catch (e) {
      console.log('Error updating advertisement:', e);
    }
  }

  changeText(textLength: number): string {
    let message = '';

    switch (true) {
      case textLength <= 1:
        message = 'ממליצים לך בחום להוסיף תיאור';
        break;

      case textLength > 0 && textLength <= 30:
        message = 'מרגיש לנו שהטקסט שכתבת קצר מידי';
        break;

      case textLength > 30 && textLength <= 60:
        message = 'יופי, המודעה הולכת לכיוון הנכון';
        break;

      case textLength > 60 && textLength <= 100:
        message = 'עוד ממש קצת וזה שם';
        break;

      case textLength >= 100 && textLength <= 130:
        message = 'אוטוטו';
        break;

      case textLength >= 130:
        message = 'בול!';
        break;

      default:
        message = 'ממליצים לך בחום להוסיף תיאור';
        break;
    }

    return message;
  }

  changeWidth(textLength: number): string {
    if (textLength >= 160) {
      return '100%';
    }
    // var width = textLength * 1.8125;
    var width = textLength * 1.9125;
    return width + 'px';
  }
  changeHieght(textLength: number): string {
    var height = textLength <= 7 ? textLength * 4.5 : 30;

    return height + 'px';
  }

  findPropertyFeature(index: number): any {
    const propertyFeature = this.propertyFeaturesChecked[index];
    const currentValueIndex = propertyFeature.key;
    if (currentValueIndex in this.advertisement) {
      return this.advertisement[
        currentValueIndex as keyof typeof this.advertisement
      ];
    }
  }

  clearTotalFloors() {
    this.advertisement.totalFloors = 0;
  }

  clearAssetDescription() {
    this.advertisement.description = '';
  }

  clearInputValue(inputName: string) {
    switch (inputName) {
      case 'houseCommitteePayment':
        this.advertisement.houseCommitteePayment = 0;
        this.isHouseCommitteePaymentEraseBtnHidden = true;
        this.activateFocusById('houseCommitteePayment');
        break;
      case 'municipalityMonthlyPropertyTax':
        this.advertisement.municipalityMonthlyPropertyTax = 0;
        this.isMunicipalityMonthlyPropertyTaxEraseBtnHidden = true;
        this.activateFocusById('municipalityMonthlyPropertyTax');
        break;
      case 'totalSquareMeters':
        this.advertisement.totalSquareMeters = 0;
        this.isTotalSquareMetersEraseBtnHidden = true;
        this.activateFocusById('totalSquareMeters');
        break;
      case 'price':
        this.advertisement.price = 0;
        this.isPriceEraseBtnHidden = true;
        this.activateFocusById('price');
        break;
      case 'description':
        this.advertisement.description = '';
        this.isDescriptionEraseBtnHidden = true;
        break;
      case 'furnituredescription':
        this.advertisement.furnituredescription = '';
        this.isFurnitureDescriptionEraseBtnHidden = true;
        break;
      case 'builtSquareMeters':
        this.advertisement.builtSquareMeters = 0;
        this.isBuiltSquareMetersEraseBtnHidden = true;
        this.activateFocusById('builtSquareMeters');
        break;
      case 'totalFloors':
        this.advertisement.totalFloors = 0;
        this.isTotalFloorsEraseBtnHidden = true;
        this.activateFocusById('totalFloors');
        break;
      case 'houseNumber':
        this.houseNumber = '';
        this.isHouseNumberEraseBtnHidden = true;
        this.activateFocusById('houseNumber');
        break;
      case 'contactName':
        this.advertisement.contactName = '';
        this.iscontactNameEraseBtnHidden = true;
        this.activateFocusById('contactName');
        break;
      case 'secondContactName':
        this.secondContactName = '';
        this.isSecondcontactNameEraseBtnHidden = true;
        this.activateFocusById('secondContactName');
        break;
    }
  }

  selectOption(option: string, type: string) {
    if (type === 'assetState') {
      this.advertisement.assetState = option;
    }
    if (type === 'numberOfPayments') {
      this.advertisement.numberOfPayments = option;
    }

    if (type === 'assetOwner') {
      this.asset_Owner = option;
    }
    this.closeAllDropdowns();
  }

  async uploadVideo() {
    if (!this.video) return '';
    return await this.imageuploadService
      .uploadImage(this.video)
      .then((u) => u.fileUrl);
  }

  closeAllDropdowns() {
    this.isAssetAssetstateDropdownHidden = true;
    this.isNumberOfPaymentsDropdownHidden = true;
    this.isassetOwnerDropdownHidden = true;
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
