import {
  Component,
  inject,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from './services/user/auth.service';
import { ModalStateService } from './services/modal-state.service';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    document.body.addEventListener('click', this.handleBodyClick);
  }
  authService = inject(AuthService);
  navigationService = inject(NavigationService);
  modalStateService = inject(ModalStateService);
  renderer = inject(Renderer2);

  handleBodyClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.classList.value === 'modal-overlay') {
      this.modalStateService.openOrCloseModal(false);
    }
  };
}
