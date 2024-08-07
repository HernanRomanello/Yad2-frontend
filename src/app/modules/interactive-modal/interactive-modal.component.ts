import { Component } from '@angular/core';

@Component({
  selector: 'app-interactive-modal',
  templateUrl: './interactive-modal.component.html',
  styleUrl: './interactive-modal.component.css',
})
export class InteractiveModalComponent {
  isVisible = false;

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  confirm() {
    // Add any confirmation logic or processing here
    this.closeModal();
    console.log('Continued to publish');
  }
}
