import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
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
export class TestComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  items: any[] = [
    { label: 'New', icon: 'pi pi-fw pi-plus' },
    { label: 'Open', icon: 'pi pi-fw pi-download' },
    { label: 'Undo', icon: 'pi pi-fw pi-refresh' },
  ];

  sidebarVisible = false;

  closeCallback() {
    this.sidebarVisible = false;
  }
}
