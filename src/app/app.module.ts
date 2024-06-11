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
import { TestComponent } from './test/test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { RealEstateRoomsAmountComponent } from './modules/real-estate-rooms-amount/real-estate-rooms-amount.component';
import { RealEstateAdditionalFiltersComponent } from './modules/real-estate-additional-filters/real-estate-additional-filters.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegistrationFormComponent,
    TestComponent,
    AdvertisementComponent,
    FooterComponent,
    RealEstateRoomsAmountComponent,
    RealEstateAdditionalFiltersComponent,
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
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
