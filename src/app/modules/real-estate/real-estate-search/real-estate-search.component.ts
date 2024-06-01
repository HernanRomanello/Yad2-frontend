import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent {
  searchService = inject(SearchService);
  selectedPropertyTypes: string[] = [];
  dropdownOpen = false;
  selectedOption: string | null = null;
  advertisementTypebuttonText: string = 'מכירה'; // Initial button text

  @ViewChild('propertyTypeMenu', { static: false })
  propertyTypeMenu!: ElementRef;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  togglePropertyTypeDropdown() {
    this.propertyTypeMenu.nativeElement
      .querySelector('.menu')
      .classList.toggle('hidden');
  }

  applyFilter(option: string) {
    this.selectedOption = option;
    this.dropdownOpen = false;
    this.advertisementTypebuttonText = option;
  }
  constructor(private router: Router) {}

  onSearch() {
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
  }

  onPropertyTypeSelected(propertyTypes: string[]) {
    this.selectedPropertyTypes = propertyTypes;
  }

  isPropertyTypeSelected(propertyType: string): boolean {
    return this.searchService.selectedPropertyTypes.value.includes(
      propertyType
    );
  }
}
