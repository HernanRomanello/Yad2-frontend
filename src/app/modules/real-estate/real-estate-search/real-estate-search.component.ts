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
  cities: any[]; // Define the type according to your data structure
  selectedCity: any;
  dropdownOpen = false;
  selectedOption: string | null = null;
  message: string = '';
  buttonText: string = 'מכירה';

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  applyFilter1(option: string) {
    this.selectedOption = option;
    this.buttonText = option; // Update the button text
    this.dropdownOpen = false;
  }
  constructor(private router: Router) {
    this.cities = [
      { label: 'New York', value: 'NY' },
      { label: 'Los Angeles', value: 'LA' },
      { label: 'Chicago', value: 'CHI' },
    ];
    this.selectedCity = null; // Or assign a default value
  }

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
