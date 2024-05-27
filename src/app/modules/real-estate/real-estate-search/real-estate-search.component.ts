import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent {
  searchQuery: string = '';
  selectedFilters: string[] = [];

  constructor(private router: Router) {}

  onSearch() {
    this.router.navigate(['real-estate-search/results'], {
      queryParams: {
        query: this.searchQuery,
        filters: this.selectedFilters.join(','),
      },
    });
  }

  applyFilter(filter: string) {
    if (!this.selectedFilters.includes(filter)) {
      this.selectedFilters.push(filter);
    } else {
      this.selectedFilters = this.selectedFilters.filter((f) => f !== filter);
    }
  }
}
