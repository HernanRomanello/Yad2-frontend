import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { formatPrice } from '../../../utilities';
@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent {
  searchService = inject(SearchService);
  selectedPropertyTypes: string[] = [];
  selectedPriceRange: [number, number] = [-1, 20000];
  dropdownOpen = false;
  selectedOption: string | null = null;
  advertisementTypebuttonText: string = 'מכירה';
  title = 'נדל"ן למכירה';

  @ViewChild('propertyTypeMenu', { static: false })
  propertyTypeMenu!: ElementRef;

  @ViewChild('priceSlider', { static: false })
  priceSlider!: ElementRef;
  @ViewChild('priceSliderButton', { static: false })
  priceSliderButton!: ElementRef;

  constructor(private router: Router) {
    afterNextRender(() => {
      document.body.addEventListener('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        if (this.propertyTypeMenu.nativeElement.contains(clickedElement)) {
          return;
        } else if (this.priceSlider.nativeElement.contains(clickedElement)) {
          return;
        }
        const isSliderHidden = this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.contains('hidden');

        if (!isSliderHidden && this.isPriceRangeSelected()) {
          alert('Please select a price range');
          this.priceSliderButton.nativeElement.innerText = `${formatPrice(
            this.selectedPriceRange[1]
          )} - ${formatPrice(this.selectedPriceRange[0])}
          `;
          this.priceSliderButton.nativeElement.innerHTML +=
            '<i class="material-icons">keyboard_arrow_down</i>';
        }

        this.propertyTypeMenu.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
        this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
      });
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMenu(type: 'priceSlider' | 'propertyTypeMenu') {
    switch (type) {
      case 'priceSlider':
        this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.toggle('hidden');
        break;
      case 'propertyTypeMenu':
        this.propertyTypeMenu.nativeElement
          .querySelector('.menu')
          .classList.toggle('hidden');
        break;
    }
  }

  applyFilter(option: 'מכירה' | 'השכרה') {
    this.selectedOption = option;
    this.dropdownOpen = false;
    this.advertisementTypebuttonText = option;
    this.title = option === 'מכירה' ? 'נדל"ן למכירה' : 'נדל"ן להשכרה';
    this.searchService.emitSelectedTradeType(option);
  }

  onSearch() {
    this.searchService.emitSelectedPriceRange(this.selectedPriceRange);
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
  }

  onPriceRangeSelected(priceRange: [number, number]) {
    this.selectedPriceRange = priceRange;
  }

  onPropertyTypeSelected(propertyTypes: string[]) {
    this.selectedPropertyTypes = propertyTypes;
  }

  isPriceRangeSelected() {
    return this.selectedPriceRange[0] !== -1;
  }

  isPropertyTypeSelected(propertyType: string): boolean {
    return this.searchService.selectedPropertyTypes.value.includes(
      propertyType
    );
  }
}
