import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { ModalStateService } from '../../services/modal-state.service';

@Component({
  selector: 'app-alternative-header',
  templateUrl: './alternative-header.component.html',
  styleUrl: './alternative-header.component.css',
})
export class AlternativeHeaderComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.authSerrvice.userName1.unsubscribe();
    this.authSerrvice.firstLetterUserEmailAddress1.unsubscribe();
  }
  userName = '';
  firstLetterUserEmailAddress = '';

  authSerrvice = inject(AuthService);
  modalStateSerrvice = inject(ModalStateService);
  isUserAreaDropdownVisible = false;

  ngOnInit(): void {
    this.authSerrvice.userName1.subscribe((name) => {
      this.userName = name;
    });
    this.authSerrvice.firstLetterUserEmailAddress1.subscribe((letter) => {
      this.firstLetterUserEmailAddress = letter;
    });
  }

  isUserAreaDropdownOpen(isUserAreaDropdownOpen: boolean) {
    this.isUserAreaDropdownVisible = isUserAreaDropdownOpen;
  }
}
