import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealEstateRoutingModule } from './real-estate-routing.module';
import { RealEstateSearchComponent } from './real-estate-search/real-estate-search.component';
import { RealEstateResultsComponent } from './real-estate-results/real-estate-results.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RealEstateSearchComponent, RealEstateResultsComponent],
  imports: [CommonModule, MatIconModule, RealEstateRoutingModule],
})
export class RealEstateModule {}
