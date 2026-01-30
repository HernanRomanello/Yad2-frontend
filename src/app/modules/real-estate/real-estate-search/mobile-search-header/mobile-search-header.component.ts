import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-search-header',
  templateUrl: './mobile-search-header.component.html',
  styleUrl: './mobile-search-header.component.css',
})
export class MobileSearchHeaderComponent {
  @Input() title = 'חיפוש נדל״ן';

  @Output() filterClick = new EventEmitter<void>();
  @Output() historyClick = new EventEmitter<void>();
}
