import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationFormComponent } from './modules/registration-form/registration-form.component';
import { LoginComponent } from './modules/login/login.component';
import { authGuard } from './Guards/auth.guard';
import { AdvertisementComponent } from './modules/advertisement/advertisement.component';
import { CreateNewAdvertisementComponent } from './modules/create-new-advertisement/create-new-advertisement.component';
import { PostAdConfirmationModalComponent } from './modules/post-ad-confirmation-modal/post-ad-confirmation-modal.component';
import { EditAdvertisementComponent } from './modules/edit-advertisement/edit-advertisement.component';
import { FavoriteAdsComponent } from './modules/favorite-ads/favorite-ads.component';
import { favoritesNotesResolver } from './Resolvers/favoritesNotes.resolver';
import { favoritesAdResolver } from './Resolvers/favorites-ad.resolver';
import { LastSearchesComponent } from './modules/user-area/last-searches/last-searches.component';
import { ImagesComponent } from './modules/images/images.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: ' התחברות יד2',
  },
  {
    path: 'register',
    component: RegistrationFormComponent,
    title: ' התחברות יד2',
  },
  {
    path: 'user-images/:id',
    component: ImagesComponent,
    title: 'תמונות',
    canActivate: [authGuard],
  },
  {
    path: 'favorites',
    title: 'איזור אישי יד 2 - מועדפים ',
    component: FavoriteAdsComponent,
    canActivate: [authGuard],
    resolve: {
      userNotes: favoritesNotesResolver,
      userAds: favoritesAdResolver,
    },
  },

  {
    path: 'last-searches',
    title: 'חיפושים אחרונים יד 2 ',
    component: LastSearchesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'advertisement/:id',
    component: AdvertisementComponent,
    title: 'Advertisement Details',
  },
  {
    path: 'create-advertisement',
    component: CreateNewAdvertisementComponent,
    title: 'פרסום מודעה חדשה',
    canActivate: [authGuard],
  },

  {
    path: 'edit-advertisement/:id',
    component: EditAdvertisementComponent,
    title: 'עריכת מודעה',
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
        (m) => m.UserAreaModule,
      ),
    title: 'אזור אישי יד 2 ',
    canActivate: [authGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/real-estate/real-estate.module').then(
        (m) => m.RealEstateModule,
      ),
    title: 'נדל"ן מודעות ',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
