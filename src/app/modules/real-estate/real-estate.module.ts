import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealEstateRoutingModule } from './real-estate-routing.module';
import { RealEstateSearchComponent } from './real-estate-search/real-estate-search.component';
import { RealEstateResultsComponent } from './real-estate-results/real-estate-results.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { RealEstatePropertyTypeComponent } from './real-estate-property-type/real-estate-property-type.component';
import { SliderModule } from 'primeng/slider';
import { RealEstatePriceSliderComponent } from './real-estate-price-slider/real-estate-price-slider.component';
import { RealEstateAdditionalFiltersComponent } from '../real-estate-additional-filters/real-estate-additional-filters.component';
import { RealEstateRoomsAmountComponent } from '../real-estate-rooms-amount/real-estate-rooms-amount.component';
import { RealEstateFloorSliderSelectComponent } from './real-estate-price-slider-select/real-estate-price-slider-select.component';
import { RealEstateSquareSizeSliderComponent } from '../real-estate-price-slider-component2/real-estate-price-slider-component2.component';
import { MobileSearchHeaderComponent } from './real-estate-search/mobile-search-header/mobile-search-header.component';

@NgModule({
  declarations: [
    RealEstateSearchComponent,
    RealEstateResultsComponent,
    RealEstatePropertyTypeComponent,
    RealEstateAdditionalFiltersComponent,
    RealEstateRoomsAmountComponent,
    MobileSearchHeaderComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    SliderModule,
    RealEstateRoutingModule,
    RealEstatePriceSliderComponent,
    RealEstateFloorSliderSelectComponent,
    ListboxModule,
    FormsModule,
    RealEstateSquareSizeSliderComponent,
  ],
})
export class RealEstateModule {}
