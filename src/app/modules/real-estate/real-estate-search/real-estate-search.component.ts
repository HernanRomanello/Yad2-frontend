import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent {
  dropdownOpen = false;
  selectedOption: string | null = null;
  advertisementTypebuttonText: string = 'מכירה'; // Initial button text
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  applyFilter(option: string) {
    this.selectedOption = option;
    this.dropdownOpen = false;
    this.advertisementTypebuttonText = option;
  }
  constructor(private router: Router) {}

  onSearch() {}
}
