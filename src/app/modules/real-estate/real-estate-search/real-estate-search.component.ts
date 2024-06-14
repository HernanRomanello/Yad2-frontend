import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
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
  selectedRoomsAmount: string[] = [];
  selectedOption: string | null = null;
  advertisementTypebuttonText: string = 'מכירה';
  title = 'נדל"ן למכירה';

  @ViewChild('propertyTypeMenu', { static: false })
  propertyTypeMenu!: ElementRef;

  @ViewChild('roomsAmountMenu', { static: false })
  roomsAmountMenu!: ElementRef;

  @ViewChild('priceSlider', { static: false })
  priceSlider!: ElementRef;

  @ViewChild('additionalFiltersMenu', { static: false })
  additionalFiltersMenu!: ElementRef;

  @ViewChild('priceSliderButton', { static: false })
  priceSliderButton!: ElementRef;

  @ViewChild('tradeTypeMenu', { static: false })
  tradeTypeMenu!: ElementRef;

  constructor(private router: Router) {
    afterNextRender(() => {
      document.body.addEventListener('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        if (this.propertyTypeMenu.nativeElement.contains(clickedElement)) {
          return;
        } else if (this.priceSlider.nativeElement.contains(clickedElement)) {
          // alert('propertyTypeMenu');
          // alert('propertyTypeMenu');
          // alert('priceSlider' + this.selectedPriceRange[1]);
          if (this.selectedPriceRange[0] !== -1) {
            // changeButtonInnerHtml(
            //   this.priceSliderButton,
            //   this.selectedPriceRange
            // );
          }

          return;
        } else if (
          this.roomsAmountMenu.nativeElement.contains(clickedElement)
        ) {
          return;
        }
        const isSliderHidden = this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.contains('hidden');

        if (!isSliderHidden && this.selectedPriceRange[0] !== -1) {
          changeButtonInnerHtml(
            this.priceSliderButton,
            this.selectedPriceRange
          );
        }

        this.propertyTypeMenu.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
        this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
        this.roomsAmountMenu.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
        this.rotateAllArrows();

        function changeButtonInnerHtml(
          priceSliderButton: ElementRef,
          selectedPriceRange: [number, number]
        ) {
          priceSliderButton.nativeElement.innerText = `${formatPrice(
            selectedPriceRange[1]
          )} - ${formatPrice(selectedPriceRange[0])}
          `;
          priceSliderButton.nativeElement.innerHTML +=
            '<i class="material-icons">keyboard_arrow_down</i>';
        }
      });
    });
  }

  toggleMenu(
    type:
      | 'priceSlider'
      | 'propertyTypeMenu'
      | 'roomsAmountMenu'
      | 'additionalFiltersMenu'
      | 'tradeTypeMenu'
  ) {
    switch (type) {
      case 'priceSlider':
        this.toggleMenuDropdown(this.priceSlider);
        break;
      case 'propertyTypeMenu':
        this.toggleMenuDropdown(this.propertyTypeMenu);

        break;
      case 'roomsAmountMenu':
        this.toggleMenuDropdown(this.roomsAmountMenu);
        break;
      case 'additionalFiltersMenu':
        this.toggleMenuDropdown(this.additionalFiltersMenu);
        break;
      case 'tradeTypeMenu':
        this.toggleMenuDropdown(this.tradeTypeMenu);
        break;
    }
  }

  toggleMenuDropdown(tradeTypeMenu: any): void {
    const menu = tradeTypeMenu.nativeElement.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }

    const arrow = tradeTypeMenu.nativeElement.querySelector('.material-icons');
    if (arrow) {
      arrow.classList.toggle('arrow-up');
    }
  }

  rotateAllArrows() {
    const arrows = document.querySelectorAll('.material-icons');
    arrows.forEach((arrow) => {
      if (arrow.classList.contains('arrow-up')) {
        arrow.classList.remove('arrow-up');
      }
    });
  }

  applyFilter(option: 'מכירה' | 'השכרה') {
    this.selectedOption = option;
    this.advertisementTypebuttonText = option;
    this.title = option === 'מכירה' ? 'נדל"ן למכירה' : 'נדל"ן להשכרה';
    this.tradeTypeMenu.nativeElement
      .querySelector('.menu')
      .classList.add('hidden');
    this.searchService.emitSelectedTradeType(option);
  }

  onSearch() {
    this.searchService.emitSelectedPriceRange(this.selectedPriceRange);
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
    this.searchService.emitSelectedRoomsAmount(this.selectedRoomsAmount);
  }

  onPriceRangeSelected(priceRange: [number, number]) {
    this.selectedPriceRange = priceRange;
  }

  onPropertyTypeSelected(propertyTypes: string[]) {
    this.selectedPropertyTypes = propertyTypes;
  }

  onRoomsAmountSelected(roomsAmount: string[]) {
    this.selectedRoomsAmount = roomsAmount;
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
