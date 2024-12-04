import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-last-searches',
  templateUrl: './last-searches.component.html',
  styleUrl: './last-searches.component.css',
})
export class LastSearchesComponent implements OnInit, OnDestroy {
  searches = ['search1', 'search2', 'search3', 'search4', 'search5'];
  constructor(private navigationService: NavigationService) {}

  ngOnDestroy() {
    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(false);
  }
  ngOnInit() {
    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(true);
  }
}
