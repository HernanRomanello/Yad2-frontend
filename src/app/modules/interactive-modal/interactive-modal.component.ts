import { Component, inject, OnInit } from '@angular/core';
import { ModalStateService } from '../../services/modal-state.service';
import { ModalContent } from '../../shared/models/Modal';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-interactive-modal',
  templateUrl: './interactive-modal.component.html',
  styleUrls: ['./interactive-modal.component.css'], // Corrected from 'styleUrl'
})
export class InteractiveModalComponent implements OnInit {
  modalContent!: ModalContent;

  modalstate = inject(ModalStateService);
  authSerrvice = inject(AuthService);

  ngOnInit() {
    this.modalstate.currentModalContent.subscribe((content) => {
      this.modalContent = content;
    });
    this.modalstate.setModalContent(0);
  }

  openModal() {
    this.modalstate.openOrCloseModal(true);
  }

  closeModal() {
    this.modalstate.openOrCloseModal(false);
  }

  confirm() {
    this.closeModal();
  }
}
