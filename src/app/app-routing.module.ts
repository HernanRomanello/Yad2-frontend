import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationFormComponent } from './modules/registration-form/registration-form.component';
import { LoginComponent } from './modules/login/login.component';
import { authGuard } from './Guards/auth.guard';
import { AdvertisementComponent } from './modules/advertisement/advertisement.component';
import { CreateNewAdvertisementComponent } from './modules/create-new-advertisement/create-new-advertisement.component';
import { PostAdConfirmationModalComponent } from './modules/post-ad-confirmation-modal/post-ad-confirmation-modal.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign in',
    // canActivate: [authGuard],
  },
  {
    path: 'register',
    component: RegistrationFormComponent,
    title: 'Registration',
  },
  {
    path: 'advertisement/:id',
    component: AdvertisementComponent,
    title: 'Advertisement Details',
  },
  {
    path: 'create-advertisement',
    component: CreateNewAdvertisementComponent,
    title: 'Create New Advertisement',
    canActivate: [authGuard],
  },

  {
    path: 'confirmation-modal',
    component: PostAdConfirmationModalComponent,
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/user-area/user-area.module').then(
        (m) => m.UserAreaModule
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/real-estate/real-estate.module').then(
        (m) => m.RealEstateModule
      ),
    title: 'Main Page',
    // canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
