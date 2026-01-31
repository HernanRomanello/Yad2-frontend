import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.css',
})
export class MobileHeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
  @Output() chatClick = new EventEmitter<void>();
  navigation = inject(NavigationService);

  toggleMenu() {
    this.menuToggle.emit();
  }
}
