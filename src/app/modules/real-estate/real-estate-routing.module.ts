// real-estate-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RealEstateSearchComponent } from './real-estate-search/real-estate-search.component';

const routes: Routes = [
  {
    path: '',
    component: RealEstateSearchComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealEstateRoutingModule {}
