import { Component, inject } from '@angular/core';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-real-estate-results',
  templateUrl: './real-estate-results.component.html',
  styleUrls: [
    './real-estate-results.component.css',
    // '../../user-area/user-advertisement/user-advertisement.component.css',
  ],
})
export class RealEstateResultsComponent {
  advertisementService = inject(AdvertisementService);
}
