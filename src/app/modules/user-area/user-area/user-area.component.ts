import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RealEstateResultsComponent } from '../../real-estate/real-estate-results/real-estate-results.component';
import { AuthService } from '../../../services/user/auth.service';

@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: [
    './user-area.component.css',
    '../../real-estate/real-estate-results/real-estate-results.component.css',
  ],
})
export class UserAreaComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  ngOnDestroy(): void {
    this.authService.IsHeaderAndFooterOpen(true);
  }
  ngOnInit(): void {
    this.authService.IsHeaderAndFooterOpen(false);
  }
}
