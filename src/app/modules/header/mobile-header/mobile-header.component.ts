import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.css',
})
export class MobileHeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
  @Output() chatClick = new EventEmitter<void>();

  toggleMenu() {
    this.menuToggle.emit();
  }
}
