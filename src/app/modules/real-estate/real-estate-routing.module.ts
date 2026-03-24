import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RealEstateSearchComponent } from './real-estate-search/real-estate-search.component';
import { addsResolver } from '../../Resolvers/adds.resolver';

const routes: Routes = [
  {
    path: '',
    component: RealEstateSearchComponent,
    resolve: {
      ads: addsResolver,
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealEstateRoutingModule {}
