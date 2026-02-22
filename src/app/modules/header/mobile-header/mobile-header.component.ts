import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.css',
})
export class MobileHeaderComponent {
  sidebarOpen = false;
  theme: 'dark' | 'light' = 'dark';

  openSidebar() {
    this.sidebarOpen = true;
  }

  navigation = inject(NavigationService);
}
