import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-post-ad-confirmation-modal',
  templateUrl: './post-ad-confirmation-modal.component.html',
  styleUrl: './post-ad-confirmation-modal.component.css',
})
export class PostAdConfirmationModalComponent implements OnInit, OnDestroy {
  constructor(private navigationService: NavigationService) {}
  ngOnDestroy(): void {
    // this.navigationService.isalternativeHeaderISOpen(false);
  }

  ngOnInit() {
    // this.navigationService.isalternativeHeaderISOpen(false);
  }
}
