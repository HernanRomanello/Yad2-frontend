import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value !== null && value !== undefined) {
      const formattedValue = value.toLocaleString('en-US');
      return `${formattedValue} ₪`;
    }
    return '';
  }
}
