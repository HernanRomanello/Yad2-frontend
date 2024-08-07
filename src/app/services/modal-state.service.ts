import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ModalContent } from '../shared/models/Modal';

@Injectable({
  providedIn: 'root',
})
export class ModalStateService {
  isModalVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentModalContent = new Subject<ModalContent>();

  openOrCloseModal(isVisible: boolean) {
    this.isModalVisible.next(isVisible);
  }

  setModalContent(modalIndex: number) {
    this.currentModalContent.next(this.modals[modalIndex]);
  }

  modals: ModalContent[] = [
    {
      title: 'יציאה מתהליך פרסום',
      class: 'exit-from-CreateAd',
      rightButtonClass: 'right-button',
      leftButtonClass: 'left-button',
      rightButtonContent: 'יציאה ללא שמירה',
      leftButtonContent: 'חזרה לפרסום',
    },
  ];
  constructor() {}
}
