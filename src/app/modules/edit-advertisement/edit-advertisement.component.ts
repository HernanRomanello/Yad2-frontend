import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementService } from '../../services/advertisement.service';
import { catchError } from 'rxjs';
import { InputsStyleService } from '../../services/inputs-style.service';

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
  isNumberOfPaymentsDropdownHidden = true;
  asset_State = '';
  numberValuesForForm: (string | number)[] = new Array(5);

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

  ngOnDestroy(): void {
    this.authService.ISEditAdvertisementISOpen.next(false);
    this.authService.IsalternativeHeaderISOpen.next(false);
    this.authService.IsHeaderAndFooterOpen(true, true);
    this.authService.SetPageRender('');
  }

  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  advertisementService = inject(AdvertisementService);
  inputsStyleService = inject(InputsStyleService);

  constructor() {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const clickOutsdieDropdown =
        !target.classList.contains('dropdown-btn') ||
        target.classList.contains(
          'input-container' ||
            'advertisement' ||
            'space-block' ||
            'edit-container'
        );

      // alert(target.classList);
      // alert(clickOutsdieDropdown);
      if (clickOutsdieDropdown === true) {
        // alert(clickOutsdieDropdown);
        // document.body.click();
        this.closeAllDropdowns();
      }
    });
    document.addEventListener('keyup', (event) => {
      // this.formatNumbersInTheForm();
      console.log(this.addCommasToNumber1('1234567.89')); // Output: "1,234,567.89"
      console.log(this.addCommasToNumber1('abc')); // Output: "abc" (unchanged)
      console.log(this.addCommasToNumber1('894d8 8des4efw 8ewq94d')); // Output: "" (unchanged)
      console.log(this.addCommasToNumber1('888w 9wd9q ')); // Output: "" (unchanged)
      console.log(this.addCommasToNumber1('4fe89wef4 44')); // Output: "" (unchanged)
      console.log(this.addCommasToNumber1('4fe89wef4 44')); // Output: "" (unchanged)
      console.log(this.addCommasToNumber1('8888')); // Output: "" (unchanged)
      console.log(this.addCommasToNumber1('88888977')); // Output: "" (unchanged)
      const target = event.target as HTMLElement;
      this.formatNumbersInTheForm(target.id);
      // alert(target.id);
    });

    // Helper method to add commas to a number string
  }

  openAndCloseDropdown(type: string, dropdownTypeWasClicked: boolean) {
    const dropdownTypeWasClickedState = dropdownTypeWasClicked;
    const dropdownTypeWasClickedNewState = !dropdownTypeWasClickedState;
    this.closeAllDropdowns();
    if (type === 'assetState') {
      this.isAssetAssetstateDropdownHidden = dropdownTypeWasClickedNewState;
    } else if (type === 'numberOfPayments') {
      this.isNumberOfPaymentsDropdownHidden = dropdownTypeWasClickedNewState;
    }
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
    //   for (let i = 0; i < AllNumbersInputsInForm.length; i++) {
    //     const input = AllNumbersInputsInForm[i] as HTMLInputElement;
    //     // alert(input.value);
    //     input.value = this.addCommasToNumber(input.value);
    //   }
  }

  addCommasToNumber(num: string): string {
    const number = parseInt(num);
    // alert(number);
    // if (isNaN(number)) {
    //   alert('not a number');
    //   return num;
    // }

    if (!/^\d+$/.test(num)) {
      // alert('Input is not a valid number');
      return num;
    }

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  addCommasToNumber1(num: string): string {
    // Convert input to a number
    const number = parseFloat(num);

    // Check if the conversion resulted in a valid number
    if (isNaN(number)) {
      return num; // Return the original input if it's not a valid number
    }

    // Convert the valid number back to a string and add commas
    return number.toLocaleString(); // Using toLocaleString for formatting
  }

  removeCommasFromNumberAndParseInt(value: string): number {
    return parseFloat(value.replace(/,/g, ''));
  }
  changeColor(textLength: number): string {
    let message = 'ממליצים לך בחום להוסיף תיאור';
    let className = 'fill-loading-bar';

    switch (true) {
      case textLength <= 1:
        message = 'ממליצים לך בחום להוסיף תיאור';
        className = 'fill-loading-bar';
        break;

      case textLength > 0 && textLength <= 30:
        message = 'מרגיש לנו שהטקסט שכתבת קצר מידי';
        className = 'red-gradient fill-loading-bar';
        break;

      case textLength > 30 && textLength <= 60:
        message = 'יופי, המודעה הולכת לכיוון הנכון';
        className = 'dark-yellow-gradient fill-loading-bar';
        break;

      case textLength > 60 && textLength <= 100:
        message = 'עוד ממש קצת וזה שם';
        className = 'yellow-gradient fill-loading-bar';
        break;

      case textLength >= 100 && textLength <= 130:
        message = 'אוטוטו...';
        className = 'light-yellow-gradient fill-loading-bar';
        break;

      case textLength >= 130:
        message = 'בול!';
        className = 'green-gradient fill-loading-bar';
        break;

      default:
        message = 'ממליצים לך בחום להוסיף תיאור';
        className = 'fill-loading-bar';
        break;
    }

    // this.descriptionFurnitureMessage = message;

    return className;
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
        message = 'אוטוטו...';
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
    var width = textLength * 1.8125;
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
  clearFurnitureDescription() {
    this.advertisement.furnituredescription = '';
  }
  clearAssetDescription() {
    this.advertisement.description = '';
  }

  selectOption(option: string, type: string) {
    if (type === 'assetState') {
      this.advertisement.assetState = option;
    }
    if (type === 'numberOfPayments') {
      this.advertisement.numberOfPayments = option;
    }
    this.closeAllDropdowns();
  }

  closeAllDropdowns() {
    this.isAssetAssetstateDropdownHidden = true;
    this.isNumberOfPaymentsDropdownHidden = true;
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
