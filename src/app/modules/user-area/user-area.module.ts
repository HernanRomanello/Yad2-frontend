import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAreaRoutingModule } from './user-area-routing.module';
import { UserAreaComponent } from './user-area/user-area.component';
import { UserAdvertisementComponent } from './user-advertisement/user-advertisement.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { StatisticComponent } from './statistic/statistic.component';
import { LastSearchesComponent } from './last-searches/last-searches.component';
import { TipsInformationComponent } from './tips-information/tips-information.component';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PhoneNumberFormatPipe } from '../../pipes/phone-number-format.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadProfileImageComponent } from './upload-profile-image/upload-profile-image.component';

@NgModule({
  declarations: [
    UserAreaComponent,
    UserAdvertisementComponent,
    EditDetailsComponent,
    StatisticComponent,
    LastSearchesComponent,
    TipsInformationComponent,
    PhoneNumberFormatPipe,
    UploadProfileImageComponent,
  ],
  imports: [
    CommonModule,
    UserAreaRoutingModule,
    MatIconModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserAreaModule {}
