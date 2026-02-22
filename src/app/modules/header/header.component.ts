import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { UserModel } from '../../shared/models/UserModel';
import { ModalStateService } from '../../services/modal-state.service';
import { ModalContent } from '../../shared/models/Modal';
import { NavigationService } from '../../services/navigation.service';
import { SearchService } from '../../services/search.service';

type MenuTriggers = {
  menu_User: boolean;
  menu_PostAd: boolean;
  menu_FavoriteAds: boolean;
  menu_Yad2Magazine: boolean;
  menu_proffesionals: boolean;
  menu_Pets: boolean;
  menu_BusinessesforSale: boolean;
  menu_JobsIL: boolean;
  menu_Yad2: boolean;
  menu_Cars: boolean;
  menu_RealEstate: boolean;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string = '';
  userLastName: string = '';
  modalContent!: ModalContent;
  isUserAreaDropdownVisible = false;
  _LogoPic = 'assets/images/logo-default.svg';
  authService = inject(AuthService);
  navigationService = inject(NavigationService);
  modalStateSerrvice = inject(ModalStateService);
  searchService = inject(SearchService);
  isUserConnected: boolean = false;
  firstLetterUserEmailAddress = '';
  @ViewChild('alternativeHeader', { static: false })
  alternativeHeader!: ElementRef;
  favoriteAds: any = [];
  countFavoriteAds = 0;
  HasFavoriteAdsDropdownVisible = false;
  menus: MenuTriggers = {
    menu_User: false,
    menu_PostAd: false,
    menu_FavoriteAds: false,
    menu_Yad2Magazine: false,
    menu_proffesionals: false,
    menu_Pets: false,
    menu_BusinessesforSale: false,
    menu_JobsIL: false,
    menu_Yad2: false,
    menu_Cars: false,
    menu_RealEstate: false,
  };
  cursorX: number = 0;
  cursorY: number = 0;

  isUserAreaDropdownOpen(isUserAreaDropdownOpen: boolean) {
    this.isUserAreaDropdownVisible = isUserAreaDropdownOpen;
  }

  onMouseMove(event: any) {
    this.closeMenu('menu_User');
    this.cursorX = event.offsetX;
    this.cursorY = event.offsetY;
    window.scrollTo(event.offsetX + 500, 0);
    this.HasFavoriteAdsDropdownVisible = false;
  }

  ngOnDestroy() {
    this.authService.isUserLogin.unsubscribe();
    this.authService.user.unsubscribe();
    this.authService.UserFavoriteAdvertisements.unsubscribe();
  }
  ngOnInit() {
    this.searchService.GetUserLastSearches();
    this.authService.UserFavoriteAdvertisements.subscribe((ads) => {
      this.favoriteAds = ads;
      this.countFavoriteAds = ads.length;
    });
    this.countFavoriteAds = this.favoriteAds.length;
    this.authService.isUserLogin.subscribe(
      (status) => (this.isUserConnected = status),
    );
    this.authService.user.subscribe((user: UserModel | null | undefined) => {
      this.userName = user?.name || '';
      this.userLastName = user?.lastName || '';
      this.firstLetterUserEmailAddress = user?.email[0].toUpperCase() || '';
    });
  }

  setHeaderHeight(): string {
    if (this.navigationService.isPages(['create-advertisement'])) {
      return 'header2 increase-height2';
    }

    if (this.navigationService.isPages(['profile'])) {
      return 'header2 increase-height';
    } else {
      return 'header2';
    }
  }

  setLogoClassByComponent(): string {
    if (this.navigationService.isPages(['MainPage'])) {
      return 'logo-btn main-page';
    } else if (this.navigationService.isPages(['favorites', 'last-searches'])) {
      return 'logo-btn favorite-page';
    } else if (this.navigationService.isPages(['create-advertisement'])) {
      return 'logo-btn create-ad-page';
    }

    return 'logo-btn';
  }

  openMenu(menu: keyof MenuTriggers) {
    this.menus[menu] = true;
  }

  closeMenu(menu: keyof MenuTriggers) {
    this.menus[menu] = false;
  }

  getCircleClass(): string {
    this.authService.isUserLogin.subscribe(
      (status) => (this.isUserConnected = status),
    );
    return this.isUserConnected ? 'round' : 'round-gray';
  }
}
