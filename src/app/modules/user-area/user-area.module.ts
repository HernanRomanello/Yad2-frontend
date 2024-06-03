import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAreaRoutingModule } from './user-area-routing.module';
import { UserAreaComponent } from './user-area/user-area.component';
import { UserAdvertisementComponent } from './user-advertisement/user-advertisement.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { StatisticComponent } from './statistic/statistic.component';
import { FavoriteAdvertisementsComponent } from './favorite-advertisements/favorite-advertisements.component';
import { LastSearchesComponent } from './last-searches/last-searches.component';
import { TipsInformationComponent } from './tips-information/tips-information.component';
import { MatIconModule } from '@angular/material/icon';
import { CustomCurrencyPipe } from '../../pipes/custom-currency.pipe';

@NgModule({
  declarations: [
    UserAreaComponent,
    UserAdvertisementComponent,
    EditDetailsComponent,
    StatisticComponent,
    FavoriteAdvertisementsComponent,
    LastSearchesComponent,
    TipsInformationComponent,
    CustomCurrencyPipe,
  ],
  imports: [CommonModule, UserAreaRoutingModule, MatIconModule],
})
export class UserAreaModule {}
