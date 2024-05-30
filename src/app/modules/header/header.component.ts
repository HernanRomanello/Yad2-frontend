import { Component, ViewChild, ViewRef, inject } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

type MenuTriggers = {
  menu_proffesionals: boolean;
  menu_services: boolean;
  menu_products: boolean;
  menu_about: boolean;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  router = inject(Router);
  menus: MenuTriggers = {
    menu_proffesionals: false,
    menu_services: false,
    menu_products: false,
    menu_about: false,
  };

  openMenu(menu: keyof MenuTriggers) {
    this.menus[menu] = true;
  }

  closeMenu(menu: keyof MenuTriggers) {
    this.menus[menu] = false;
  }
}
