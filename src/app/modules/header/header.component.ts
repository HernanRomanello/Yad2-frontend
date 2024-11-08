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
  authSerrvice = inject(AuthService);
  modalStateSerrvice = inject(ModalStateService);
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

  isUserAreaDropdownOpen(isUserAreaDropdownOpen: boolean) {
    this.isUserAreaDropdownVisible = isUserAreaDropdownOpen;
  }

  test() {
    this.HasFavoriteAdsDropdownVisible = true;
  }

  ngOnDestroy(): void {
    this.authSerrvice.isUserLogin.unsubscribe();
    this.authSerrvice.user.unsubscribe();
    this.authSerrvice.UserFavoriteAdvertisements.unsubscribe();
  }
  ngOnInit(): void {
    this.authSerrvice.UserFavoriteAdvertisements.subscribe((ads) => {
      this.favoriteAds = ads;
      this.countFavoriteAds = ads.length;
      console.log(this.favoriteAds);
    });
    this.countFavoriteAds = this.favoriteAds.length;
    this.authSerrvice.isUserLogin.subscribe(
      (status) => (this.isUserConnected = status)
    );
    this.authSerrvice.user.subscribe((user: UserModel | null | undefined) => {
      this.userName = user?.name || '';
      this.userLastName = user?.lastName || '';
      this.firstLetterUserEmailAddress = user?.email[0].toUpperCase() || '';
    });
  }

  setHeaderHeight(): string {
    if (this.authSerrvice.IsUserAreaISOpen.getValue() === true) {
      return 'header2 increase-height';
    } else {
      return 'header2';
    }
  }

  openMenu(menu: keyof MenuTriggers) {
    this.menus[menu] = true;
  }

  closeMenu(menu: keyof MenuTriggers) {
    this.menus[menu] = false;
  }

  getCircleClass(): string {
    this.authSerrvice.isUserLogin.subscribe(
      (status) => (this.isUserConnected = status)
    );
    return this.isUserConnected ? 'round' : 'round-gray';
  }
}
