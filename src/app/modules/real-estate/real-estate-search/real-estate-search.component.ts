import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
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

  // roomFilterWasClicked: boolean = false;

  roomsFilterIsOpen: boolean = false;
  // roomsFilterArevisble: boolean = false;

  onCloseAdditionalFiltersMenu(event: any) {
    this.additionalFiltersMenu.nativeElement
      .querySelector('.menu')
      .classList.add('hidden');
  }

  constructor() {
    afterNextRender(() => {
      document.body.addEventListener('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        // if (this.roomsFilterIsOpen === true) {
        //   if (
        //     !clickedElement.classList.contains('rooms-select') &&
        //     !clickedElement.classList.contains('room-btn') &&
        //     !clickedElement.classList.contains('search-button')
        //   ) {
        //     alert('close');
        //     const roomsAmountContainer =
        //       document.getElementById('propertyRoomButton');
        //     // roomsAmountContainer?.click();

        //     roomsAmountContainer?.click();
        //     if (roomsAmountContainer) {
        //       // roomsAmountContainer.classList.add('hidden');
        //       const roomArrow = document.getElementById('propertyRoomArrow');
        //       // this.rotateRoomsBtnArrow(roomArrow);

        //       // alert(this.roomsFilterIsOpen);

        //       // this.roomsFilterArevisble = false;
        //       // this.roomsFilterIsOpen = false;
        //       // this.roomsFilterArevisble = false;
        //       if (roomArrow && this.roomsFilterIsOpen) {
        //         // roomArrow.style.transform = 'rotate(0deg)';
        //         // roomArrow.style.transform = 'scale(3)';
        //         // alert('close');
        //       }
        //     }
        //   }
        // }

        // const roomArrow = document.getElementById('propertyRoomArrow');
        // if (
        //   clickedElement.classList.contains('search-button') &&
        //   clickedElement.id === 'propertyRoomButton'
        // ) {
        // } else {
        //   this.rotateRoomsBtnArrow(roomArrow);
        // }
        if (
          !clickedElement.classList.contains('search-button') &&
          !clickedElement.classList.contains('rooms-select') &&
          !clickedElement.classList.contains('room-btn')
        ) {
          const roomsAmountContainer =
            document.getElementById('propertyRoomButton');
          roomsAmountContainer?.click();
          this.hideAllMenus('');
          // this.roomsFilterIsOpen = false;
        }

        if (clickedElement.id !== 'propertyRoomButton') {
          // this.roomsFilterIsOpen = true;
        }

        if (this.propertyTypeMenu.nativeElement.contains(clickedElement)) {
          return;
        } else if (this.priceSlider.nativeElement.contains(clickedElement)) {
          if (this.selectedPriceRange[0] !== -1) {
          }

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
        this.rotateAllArrows('tradeTypeArrow');

        if (!clickedElement.classList.contains('search-button')) {
          this.tradeTypeMenu.nativeElement
            .querySelector('.menu')
            .classList.add('hidden');
          const arrow =
            this.tradeTypeMenu.nativeElement.querySelector('#tradeTypeArrow');
          if (arrow) {
            if (arrow.classList.contains('arrow-up')) {
              arrow.classList.remove('arrow-up');
            }
          }
        }
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
        this.rotateAllArrows('PriceRangeArrow');
        this.hideAllMenus('PriceRangeMenu');
        this.roomsFilterIsOpen = false;
        break;
      case 'propertyTypeMenu':
        this.toggleMenuDropdown(this.propertyTypeMenu);
        this.rotateAllArrows('propertyTypeArrow');
        this.hideAllMenus('propertyTypeMenu');
        this.roomsFilterIsOpen = false;

        break;
      case 'roomsAmountMenu':
        this.toggleMenuDropdown(this.roomsAmountMenu);
        this.rotateAllArrows('propertyRoomArrow');
        this.hideAllMenus('propertyRoomMenu');
        break;
      case 'additionalFiltersMenu':
        this.hideAllMenus('additionalFiltersArrow');
        this.toggleMenuDropdown(this.additionalFiltersMenu);
        this.roomsFilterIsOpen = false;

        break;
      case 'tradeTypeMenu':
        this.toggleMenuDropdown(this.tradeTypeMenu);
        this.rotateAllArrows('tradeTypeArrow');
        this.hideAllMenus('tradeTypeMenu');
        this.roomsFilterIsOpen = false;
        break;
    }
  }

  private rotateRoomsBtnArrow(roomArrow: HTMLElement | null) {
    if (roomArrow && this.roomsFilterIsOpen) {
      roomArrow.style.transform = 'rotate(180deg)';
    } else if (roomArrow && !this.roomsFilterIsOpen) {
      roomArrow.style.transform = 'rotate(0deg)';
    }
  }

  // clickOnRoomFilter() {
  //   this.roomFilterWasClicked = true;
  //   const roomArrow = document.getElementById('propertyRoomArrow');
  //   if (roomArrow && this.roomFilterWasClicked) {
  //     this.roomsFilterIsOpen = true;
  //   }
  // }

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

  rotateAllArrows(id: string) {
    const arrows = document.querySelectorAll('.material-icons');

    arrows.forEach((arrow) => {
      if (arrow.classList.contains('arrow-up') && arrow.id !== id) {
        arrow.classList.remove('arrow-up');
      }
    });
  }

  hideAllMenus(id: string) {
    const menus = document.querySelectorAll('.menu');

    menus.forEach((menu) => {
      if (!menu.classList.contains('hidden') && menu.id !== id) {
        console.log(menu.id);
        if (menu.id !== 'additionalFiltersMenu') {
          // this.roomsFilterIsOpen = false;
          menu.classList.add('hidden');
        }
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
    const roomsAmountContainer =
      this.roomsAmountMenu.nativeElement.querySelector('.menu');
    if (roomsAmountContainer) {
      roomsAmountContainer.classList.add('hidden');
    }
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
