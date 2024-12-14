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

  transformToHebrewMonth(month: number): string {
    switch (month) {
      case 1:
        return 'ינואר';
      case 2:
        return 'פברואר';
      case 3:
        return 'מרץ';
      case 4:
        return 'אפריל';
      case 5:
        return 'מאי';
      case 6:
        return 'יוני';
      case 7:
        return 'יולי';
      case 8:
        return 'אוגוסט';
      case 9:
        return 'ספטמבר';
      case 10:
        return 'אוקטובר';
      case 11:
        return 'נובמבר';
      case 12:
        return 'דצמבר';
      default:
        return '';
    }
  }

  decreaseLargeString(str: string | null): string {
    if (!str) return '';
    let newString = '';
    const stringArray = str.split(',');
    stringArray.forEach((element, index) => {
      if (index < 3) {
        newString += element + ',';
      }
    });
    if (newString.endsWith(',')) {
      newString = newString.slice(0, newString.length - 1);
    }

    return newString;
  }

  ngOnDestroy() {
    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(false);
  }
  ngOnInit() {
    this.searchService.GetUserLastSearches();

    this.navigationService.isFavoriteAdvertisementOrLastsearchesIsOpen(true);
  }
}
