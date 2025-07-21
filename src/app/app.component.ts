import { Component, inject, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { AuthService } from './services/user/auth.service';
import { ModalStateService } from './services/modal-state.service';
import { NavigationService } from './services/navigation.service';
import { ResolveStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    document.body.addEventListener('click', this.handleBodyClick);

    this.router.events
      .pipe(
        filter((event): event is ResolveStart => event instanceof ResolveStart)
      )
      .subscribe((event) => {
        const url = event.urlAfterRedirects || event.url;

        this.navigationService.setComponentNavigation(url);
      });
  }
  authService = inject(AuthService);
  navigationService = inject(NavigationService);
  modalStateService = inject(ModalStateService);
  renderer = inject(Renderer2);
  router = inject(Router);

  handleBodyClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.classList.value === 'modal-overlay') {
      this.modalStateService.openOrCloseModal(false);
    }
  };
}
