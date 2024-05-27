import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { AdvertisementService } from '../../services/advertisement.service';

@Component({
  selector: 'app-reale-state',
  templateUrl: './reale-state.component.html',
  styleUrl: './reale-state.component.css',
})
export class RealeStateComponent {
  advertisementService = inject(AdvertisementService);
  // authService = inject(AuthService);
}
