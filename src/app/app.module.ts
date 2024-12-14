import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { HeaderComponent } from './modules/header/header.component';
import { LoginComponent } from './modules/login/login.component';
import { RegistrationFormComponent } from './modules/registration-form/registration-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SidebarModule } from 'primeng/sidebar';
import { ListboxModule } from 'primeng/listbox';
import { RealEstatePriceSliderComponent } from './modules/real-estate/real-estate-price-slider/real-estate-price-slider.component';
import { AdvertisementComponent } from './modules/advertisement/advertisement.component';
import { FooterComponent } from './modules/footer/footer.component';
import { CreateNewAdvertisementComponent } from './modules/create-new-advertisement/create-new-advertisement.component';
import { InteractiveModalComponent } from './modules/interactive-modal/interactive-modal.component';
import { PostAdConfirmationModalComponent } from './modules/post-ad-confirmation-modal/post-ad-confirmation-modal.component';
import { EditAdvertisementComponent } from './modules/edit-advertisement/edit-advertisement.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import 'moment/locale/he';
import { FavoriteAdsComponent } from './modules/favorite-ads/favorite-ads.component';
import { RealEstateSquareSizeSliderComponent } from './modules/real-estate-price-slider-component2/real-estate-price-slider-component2.component';
import { ImagesComponent } from './modules/images/images.component';

moment.locale('he');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegistrationFormComponent,
    AdvertisementComponent,
    FooterComponent,
    CreateNewAdvertisementComponent,
    InteractiveModalComponent,
    PostAdConfirmationModalComponent,
    EditAdvertisementComponent,
    FavoriteAdsComponent,
    ImagesComponent,
  ],
  imports: [
    BrowserModule,
    RealEstatePriceSliderComponent,
    AppRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatToolbarModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    SidebarModule,
    ListboxModule,
    FormsModule,
    BrowserModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
