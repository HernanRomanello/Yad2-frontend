import { Component, inject } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
type MenuTriggers = {
  menu_User: false;
  menu_PostAd: false;
  menu_FavoriteAds: false;
  menu_Yad2Magazine: false;
  menu_proffesionals: false;
  menu_Pets: false;
  menu_BusinessesforSale: false;
  menu_JobsIL: false;
  menu_Yad2: false;
  menu_RealEstate: false;
};

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  router = inject(Router);
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
    menu_RealEstate: false,
  };

  // openMenu(menu: keyof MenuTriggers) {
  //   this.menus[menu] = true;
  // }

  // closeMenu(menu: keyof MenuTriggers) {
  //   this.menus[menu] = false;
  // }
}
