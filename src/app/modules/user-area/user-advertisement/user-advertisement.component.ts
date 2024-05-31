import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-user-advertisement',
  templateUrl: './user-advertisement.component.html',
  styleUrls: [
    './user-advertisement.component.css',
    '../../real-estate/real-estate-results/real-estate-results.component.css',
  ],
})
export class UserAdvertisementComponent {
  authService = inject(AuthService);
  advertisementService = inject(AdvertisementService);
}
