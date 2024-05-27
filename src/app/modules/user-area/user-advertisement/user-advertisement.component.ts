import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';

@Component({
  selector: 'app-user-advertisement',
  templateUrl: './user-advertisement.component.html',
  styleUrl: './user-advertisement.component.css',
})
export class UserAdvertisementComponent {
  authService = inject(AuthService);
}
