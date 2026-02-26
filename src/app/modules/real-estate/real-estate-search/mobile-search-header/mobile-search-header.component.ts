import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';

@Component({
  selector: 'app-mobile-search-header',
  templateUrl: './mobile-search-header.component.html',
  styleUrl: './mobile-search-header.component.css',
})
export class MobileSearchHeaderComponent {
  @Input() title = 'חיפוש נדל״ן';

  @Output() filterClick = new EventEmitter<void>();
  @Output() historyClick = new EventEmitter<void>();
  navigationService = inject(NavigationService);
  searchFilterOpenClose: boolean = false;
  sortButtonThatAreOpen = <[string, boolean]>['', false];

  openSearch() {
    this.searchFilterOpenClose = true;
  }

  toggleMenu(type: string) {
    alert('efret');
    const [currentType, currentState] = this.sortButtonThatAreOpen;
    if (currentType === type) {
      this.sortButtonThatAreOpen = [type, !currentState];
    } else {
      this.sortButtonThatAreOpen = [type, true];
    }
    // this.searchSuggestionsIsOpen = false;
    // this.updateButtonsLabels();
    // switch (type) {
    //   case 'propertyTypeMenu':
    //     this.propertyTypeFilterValue =
    //       this.searchService.propertyTypeFilterValue();
    //     break;
    // }
  }

  onCloseAdditionalFiltersMenu(event: any) {
    this.searchFilterOpenClose = false;
  }
}
