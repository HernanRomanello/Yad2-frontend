import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { UserModel } from '../../shared/models/UserModel';

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
  ngOnDestroy(): void {
    this.authSerrvice.isUserLogin.unsubscribe();
  }
  ngOnInit(): void {
    this.authSerrvice.isUserLogin.subscribe(
      (status) => (this.isUserConnected = status)
    );
  }
  _LogoPic = 'assets/images/logo-default.svg';
  authSerrvice = inject(AuthService);
  isUserConnected: boolean = false;

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
