import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SliderModule } from 'primeng/slider';

import { formatPrice } from '../../../utilities';
@Component({
  selector: 'app-real-estate-price-slider',
  templateUrl: './real-estate-price-slider.component.html',
  styleUrl: './real-estate-price-slider.component.css',
  standalone: true,
  imports: [CommonModule, MatIconModule, SliderModule, FormsModule],
})
export class RealEstatePriceSliderComponent {
  rangeValuesBuyMinMax: [number, number] = [0, 20000];

  rangeValuesBuy: [number, number] = [...this.rangeValuesBuyMinMax];

  @Output() selectedPriceRange = new EventEmitter<[number, number]>();

  @Input() hasBackground = true;

  sliderClass() {
    if (this.hasBackground) {
      return 'price-slider-select price-slider-bg';
    }
    return 'price-slider-select price-slider-no-bg';
  }

  emit() {
    this.selectedPriceRange.emit(this.rangeValuesBuy);
  }
  manualSelectMinPrice(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const onlyNumerics = value.replace(/\D/g, '');
    const element = event.target as HTMLInputElement;
    const number = parseInt(onlyNumerics);
    if (isNaN(number) || number < this.rangeValuesBuyMinMax[0]) {
      element.value = this.formatPrice(this.rangeValuesBuy[0]);
      return;
    }

    this.rangeValuesBuy = [number, this.rangeValuesBuy[1]];
    element.value = this.formatPrice(number);
  }

  manualSelectMaxPrice(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const onlyNumerics = value.replace(/\D/g, '');
    const number = parseInt(onlyNumerics);
    const element = event.target as HTMLInputElement;

    if (isNaN(number) || number > this.rangeValuesBuyMinMax[1]) {
      element.value = this.formatPrice(this.rangeValuesBuy[1]);
      return;
    }
    this.rangeValuesBuy = [this.rangeValuesBuy[0], number];

    element.value = this.formatPrice(number);
  }
  formatPrice = formatPrice;
}
