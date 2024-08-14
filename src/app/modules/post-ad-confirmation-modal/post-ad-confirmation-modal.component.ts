import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-post-ad-confirmation-modal',
  templateUrl: './post-ad-confirmation-modal.component.html',
  styleUrl: './post-ad-confirmation-modal.component.css',
})
export class PostAdConfirmationModalComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  ngOnDestroy(): void {
    this.authService.IsalternativeHeaderISOpen.next(false);
  }

  ngOnInit() {
    this.authService.IsalternativeHeaderISOpen.next(true);
  }
}
