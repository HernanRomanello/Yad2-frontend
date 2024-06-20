import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-create-new-advertisement',
  templateUrl: './create-new-advertisement.component.html',
  styleUrls: ['./create-new-advertisement.component.css'],
})
export class CreateNewAdvertisementComponent implements OnInit {
  advertisementForm!: FormGroup | any;
  images: File[] = [];
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    // Initializing the FormGroup with all necessary fields as per the AdvertisementsModel
    const user = this.authService.user.getValue();
    this.advertisementForm = this.formBuilder.group({
      id: [null, Validators.required],
      city: [user?.city.toString() || '', Validators.required],
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
      assetType: ['', Validators.required],
      assetState: ['', Validators.required],
      airDirections: [null],
      view: ['', Validators.required],
      rearProperty: [false],
      rooms: ['', Validators.required],
      showerRooms: ['', Validators.required],
      privateParking: [null],
      hasPrivateParking: [false],
      hasBalcony: [false],
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
      contactName: ['', Validators.required],
      contactPhone: ['', Validators.required],
      standardizationAccepted: [false],
    });
  }
  changeTradeTypeTitle(): string {
    switch (this.advertisementForm.get('tradeType').value) {
      case 'מכירה':
        return 'אני רוצה למכור נכס';
      case 'השכרה':
        return 'אני רוצה להשכיר נכס';
      default:
        return 'אני רוצה למכור נכס';
    }
  }

  onFileChange(event: any) {
    this.images = event.target.files;
  }

  handleSubmit() {
    if (this.advertisementForm.valid) {
      console.log('Form data:', this.advertisementForm.value);
      console.log('Uploaded images:', this.images);
    } else {
      console.log('Form is not valid');
    }
    alert('Form submitted');
    alert(this.advertisementForm.get('city').value.toString());
  }
  isActive(type: string): boolean {
    return this.advertisementForm.get('tradeType').value === type;
  }
  setAdvertisementType(type: string) {
    this.advertisementForm.get('tradeType').setValue(type);
  }
}
