import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SliderModule } from 'primeng/slider';

import { formatPrice } from '../../../pipes/utilities.pipe';
@Component({
  selector: 'app-real-estate-price-slider-select',
  templateUrl: './RealEstateFloorSliderSelect.component.html',
  styleUrl: './RealEstateFloorSliderSelect.component.css',
  standalone: true,
  imports: [CommonModule, MatIconModule, SliderModule, FormsModule],
})
export class RealEstateFloorSliderSelectComponent {
  values = [
    'מרתף',
    'קרקע',
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
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
  ] as const;

  rangeValuesBuy: [number, number] = [0, this.values.length - 1] as const;

  selectedStartIndex = 0;
  selectedEndIndex = 0;

  @Output() selectedFloorRange = new EventEmitter<[string, string]>();

  @Input() hasBackground = true;

  sliderClass() {
    if (this.hasBackground) {
      return 'price-slider-select price-slider-bg';
    }
    return 'price-slider-select price-slider-no-bg';
  }

  emitStartIndex(event: any) {
    const selected = event.target.value;
    const index = this.values.indexOf(selected);
    this.selectedStartIndex = index;
    this.selectedFloorRange.emit([
      this.values[this.selectedStartIndex],
      this.values[this.selectedEndIndex],
    ]);
  }
  emitEndIndex(event: any) {
    const selected = event.target.value;
    const index = this.values.indexOf(selected);
    this.selectedEndIndex = index;
    this.selectedFloorRange.emit([
      this.values[this.selectedStartIndex],
      this.values[this.selectedEndIndex],
    ]);
  }

  emit(event: any) {
    if (!event.values) {
      return;
    }
    const [min, max] = event.values;
    this.selectedStartIndex = min;
    this.selectedEndIndex = max;
    this.selectedFloorRange.emit([this.values[min], this.values[max]]);
  }
  manualSelectMinPrice(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const onlyNumerics = value.replace(/\D/g, '');
    const element = event.target as HTMLInputElement;
    const number = parseInt(onlyNumerics);
    /*if (isNaN(number) || number < this.rangeValuesBuyMinMax[0]) {
      element.value = this.formatPrice(this.rangeValuesBuy[0]);
      return;
    }

    this.rangeValuesBuy = [number, this.rangeValuesBuy[1]];
    element.value = this.formatPrice(number);*/
  }

  manualSelectMaxPrice(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const onlyNumerics = value.replace(/\D/g, '');
    const number = parseInt(onlyNumerics);
    const element = event.target as HTMLInputElement;

    /*if (isNaN(number) || number > this.rangeValuesBuyMinMax[1]) {
      element.value = this.formatPrice(this.rangeValuesBuy[1]);
      return;
    }
    this.rangeValuesBuy = [this.rangeValuesBuy[0], number];

    element.value = this.formatPrice(number);*/
  }
  formatPrice = formatPrice;
}
