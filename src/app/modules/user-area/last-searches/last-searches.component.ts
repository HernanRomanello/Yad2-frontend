import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { SearchService } from '../../../services/search.service';
import { LastsearchesModel } from '../../../shared/models/LastsearchesModel';

@Component({
  selector: 'app-last-searches',
  templateUrl: './last-searches.component.html',
  styleUrl: './last-searches.component.css',
})
export class LastSearchesComponent implements OnInit, OnDestroy {
  searches = ['search1', 'search2', 'search3', 'search4', 'search5'];
  LastSearches!: LastsearchesModel;
  constructor(
    private navigationService: NavigationService,
    private searchService: SearchService
  ) {}

  ngOnDestroy() {
    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(false);
  }
  ngOnInit() {
    this.searchService.GetUserLastSearches().subscribe((data) => {
      this.LastSearches = data;
      console.log(this.LastSearches);
    });

    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(true);
  }
}
