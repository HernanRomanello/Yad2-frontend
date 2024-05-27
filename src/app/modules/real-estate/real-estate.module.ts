import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealEstateRoutingModule } from './real-estate-routing.module';
import { RealEstateSearchComponent } from './real-estate-search/real-estate-search.component';
import { RealEstateResultsComponent } from './real-estate-results/real-estate-results.component';


@NgModule({
  declarations: [
    RealEstateSearchComponent,
    RealEstateResultsComponent
  ],
  imports: [
    CommonModule,
    RealEstateRoutingModule
  ]
})
export class RealEstateModule { }
