import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { SearchService } from '../../../services/search.service';
import { LastsearchesModel } from '../../../shared/models/LastsearchesModel';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-last-searches',
  templateUrl: './last-searches.component.html',
  styleUrl: './last-searches.component.css',
})
export class LastSearchesComponent implements OnInit, OnDestroy {
  LastSearches$!: LastsearchesModel;
  LastSearches: BehaviorSubject<LastsearchesModel | null> =
    new BehaviorSubject<LastsearchesModel | null>(null);
  constructor(
    private navigationService: NavigationService,
    public searchService: SearchService
  ) {}

  addZeroToNumberToHour(hour: number, minutes: number): string {
    return `${hour < 10 ? '0' + hour : hour}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
  }

  ngOnDestroy() {
    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(false);
  }
  ngOnInit() {
    this.searchService.GetUserLastSearches();

    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(true);
  }
}
