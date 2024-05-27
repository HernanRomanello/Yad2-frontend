import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAreaComponent } from './user-area/user-area.component';
import { UserAdvertisementComponent } from './user-advertisement/user-advertisement.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { StatisticComponent } from './statistic/statistic.component';
import { FavoriteAdvertisementsComponent } from './favorite-advertisements/favorite-advertisements.component';
import { LastSearchesComponent } from './last-searches/last-searches.component';
import { TipsInformationComponent } from './tips-information/tips-information.component';

const routes: Routes = [
  {
    path: '',
    component: UserAreaComponent,
    children: [
      { path: 'user-advertisement', component: UserAdvertisementComponent },
      { path: 'edit-details', component: EditDetailsComponent },
      { path: 'statistic', component: StatisticComponent },
      {
        path: 'favorite-advertisements',
        component: FavoriteAdvertisementsComponent,
      },
      { path: 'last-searches', component: LastSearchesComponent },
      { path: 'tips-information', component: TipsInformationComponent },
      { path: '', redirectTo: 'user-advertisement', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAreaRoutingModule {}
