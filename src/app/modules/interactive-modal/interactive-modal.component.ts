import { Component, inject, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ModalStateService } from '../../services/modal-state.service';
import { ModalContent } from '../../shared/models/Modal';
import { AuthService } from '../../services/user/auth.service';
import { AdvertisementService } from '../../services/advertisement.service';

@Component({
  selector: 'app-interactive-modal',
  templateUrl: './interactive-modal.component.html',
  styleUrls: ['./interactive-modal.component.css'],
})
export class InteractiveModalComponent implements OnInit {
  modalContent!: ModalContent;

  modalstate = inject(ModalStateService);
  authSerrvice = inject(AuthService);
  advertisementService = inject(AdvertisementService);

  ngOnInit() {
    this.modalstate.currentModalContent.subscribe((content) => {
      this.modalContent = content;
    });
    this.modalstate.setModalContent(0);
    this.advertisementService.GetAdvertisements();
  }

  openModal() {
    this.modalstate.openOrCloseModal(true);
  }

  closeModal() {
    this.modalstate.openOrCloseModal(false);
    window.location.reload();
  }

  confirm() {
    this.closeModal();
  }
}
