import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberFormat',
})
export class PhoneNumberFormatPipe implements PipeTransform {
  transform(phoneNumber: string): string {
    const isNumber = /^[0-9]*$/.test(phoneNumber);

    if (isNumber && phoneNumber.length > 3) {
      const firstThree = phoneNumber.slice(0, 3);
      const restNumbers = phoneNumber.slice(3, 10);
      phoneNumber = firstThree + '-' + restNumbers;
    }

    return phoneNumber;
  }
}
