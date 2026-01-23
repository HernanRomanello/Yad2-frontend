import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  open = new Set<number>();

  toggleDropdown(i: number) {
    if (this.open.has(i)) this.open.delete(i);
    else this.open.add(i);
  }

  isOpen(i: number) {
    return this.open.has(i);
  }
}
