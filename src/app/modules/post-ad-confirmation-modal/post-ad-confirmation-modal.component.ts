import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-post-ad-confirmation-modal',
  templateUrl: './post-ad-confirmation-modal.component.html',
  styleUrl: './post-ad-confirmation-modal.component.css',
})
export class PostAdConfirmationModalComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}
  ngOnDestroy(): void {
    // this.authService.IsalternativeHeaderISOpen.next(false);
    this.navigationService.isalternativeHeaderISOpen(false);
    // this.authService.IsMainFooterISOpen.next(true);
  }

  ngOnInit() {
    this.authService.IsalternativeHeaderISOpen.next(true);
    this.navigationService.isalternativeHeaderISOpen(false);
    this.authService.IsMainFooterISOpen.next(false);
  }
}
