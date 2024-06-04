import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealEstateRoutingModule } from './real-estate-routing.module';
import { RealEstateSearchComponent } from './real-estate-search/real-estate-search.component';
import { RealEstateResultsComponent } from './real-estate-results/real-estate-results.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { RealEstatePropertyTypeComponent } from './real-estate-property-type/real-estate-property-type.component';

@NgModule({
  declarations: [
    RealEstateSearchComponent,
    RealEstateResultsComponent,
    RealEstatePropertyTypeComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RealEstateRoutingModule,
    ListboxModule,
    FormsModule,
  ],
})
export class RealEstateModule {}
