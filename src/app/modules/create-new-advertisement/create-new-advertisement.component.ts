import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { AuthService } from '../../services/user/auth.service';
import { ImageuploadService } from '../../services/imageupload.service';

@Component({
  selector: 'app-create-new-advertisement',
  templateUrl: './create-new-advertisement.component.html',
  styleUrls: ['./create-new-advertisement.component.css'],
})
export class CreateNewAdvertisementComponent implements OnInit {
  advertisementForm!: FormGroup | any;
  asset_type: string | undefined = undefined;
  images: File[] = [];
  video: File | undefined = undefined;
  authService = inject(AuthService);
  imageService = inject(ImageuploadService);
  formBuilder = inject(FormBuilder);
  isAssetTypeDropdownHidden = false;
  isAssetAssetstateDropdownHidden = false;
  @ViewChild('dropdownIcon', { static: true }) dropdownIcon1!: ElementRef;
  @ViewChild('dropdownIcon', { static: true }) dropdownIcon2!: ElementRef;
  constructor(private renderer: Renderer2) {}
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
      airDirections: [null],
      view: ['', Validators.required],
      rearProperty: [false],
      rooms: ['', Validators.required],
      showerRooms: ['', Validators.required],
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
    if (!this.asset_type) {
      alert('Asset type is required');
      return;
    }
    const form = this.advertisementForm.value;
    form.assetType = this.asset_type;
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

  isActive(type: string): boolean {
    return this.advertisementForm.get('tradeType').value === type;
  }
  setAdvertisementType(type: string) {
    this.advertisementForm.get('tradeType').setValue(type);
  }

  toggleDropdown(type: string): void {
    if (type === 'assetType') {
      this.isAssetTypeDropdownHidden = !this.isAssetTypeDropdownHidden;
    } else if (type === 'assetState') {
      this.isAssetAssetstateDropdownHidden =
        !this.isAssetAssetstateDropdownHidden;
    }
    // const action = this.isAssetTypeDropdownHidden ? 'removeClass' : 'addClass';
    // this.renderer[action](this.dropdownIcon1.nativeElement, 'rotate-icon');
    // isHidden = !isHidden;
  }

  selectAssetType(option: string, isHidden: boolean) {
    console.log('Selected asset type:', option);
    this.isAssetTypeDropdownHidden = false;
    this.asset_type = option;
    isHidden = false;
  }

  rotateIcon(isHidden: boolean): string {
    return !isHidden ? 'material-icons' : 'material-icons rotate-icon';
  }
}
