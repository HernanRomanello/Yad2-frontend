import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  authService = inject(AuthService);
}
