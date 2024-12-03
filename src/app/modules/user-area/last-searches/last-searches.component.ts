import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-last-searches',
  templateUrl: './last-searches.component.html',
  styleUrl: './last-searches.component.css',
})
export class LastSearchesComponent implements OnInit, OnDestroy {
  constructor(private navigationService: NavigationService) {}

  ngOnDestroy() {
    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(false);
  }
  ngOnInit() {
    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(true);
  }
}
