import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { UserModel } from '../../shared/models/UserModel';
import { ModalStateService } from '../../services/modal-state.service';
import { ModalContent } from '../../shared/models/Modal';
import { Router } from '@angular/router';

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
  modalContent!: ModalContent;
  isUserAreaDropdownVisible = false;
  _LogoPic = 'assets/images/logo-default.svg';
  authSerrvice = inject(AuthService);
  modalStateSerrvice = inject(ModalStateService);
  router = inject(Router);
  isUserConnected: boolean = false;
  firstLetterUserEmailAddress = '';

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

  ngOnDestroy(): void {
    this.authSerrvice.isUserLogin.unsubscribe();
    this.authSerrvice.user.unsubscribe();
  }
  ngOnInit(): void {
    this.authSerrvice.isUserLogin.subscribe(
      (status) => (this.isUserConnected = status)
    );
    this.authSerrvice.user.subscribe((user: UserModel | null | undefined) => {
      this.userName = user?.name || '';
      this.firstLetterUserEmailAddress = user?.email[0].toUpperCase() || '';
    });
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
