import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationFormComponent } from './modules/registration-form/registration-form.component';
import { LoginComponent } from './modules/login/login.component';
import { authGuard } from './Guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign in',
  },
  {
    path: 'register',
    component: RegistrationFormComponent,
    title: 'Registration',
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
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
