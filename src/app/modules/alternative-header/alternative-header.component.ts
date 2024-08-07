import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { ModalStateService } from '../../services/modal-state.service';

@Component({
  selector: 'app-alternative-header',
  templateUrl: './alternative-header.component.html',
  styleUrl: './alternative-header.component.css',
})
export class AlternativeHeaderComponent {
  authSerrvice = inject(AuthService);
  modalStateSerrvice = inject(ModalStateService);
  isUserAreaDropdownVisible = false;

  isUserAreaDropdownOpen(isUserAreaDropdownOpen: boolean) {
    this.isUserAreaDropdownVisible = isUserAreaDropdownOpen;
  }
}
