import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { UserNoteModel } from '../../shared/models/UserNoteModel';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-favorite-ads',
  templateUrl: './favorite-ads.component.html',
  styleUrl: './favorite-ads.component.css',
})
export class FavoriteAdsComponent implements OnInit, OnDestroy {
  hasPopupOpen: boolean = true;
  userNotes: UserNoteModel[] | null = null;

  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
    public navigationService: NavigationService
  ) {}

  openInNewWindow(adId: string): void {
    const url = `/advertisement/${adId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openOrCloseAdNote(index: number, isOpen: boolean): void {
    let noteAreaButton = document.getElementById('ad-note' + index.toString());
    let noteArea = document.getElementById('ad-note-open' + index.toString());
    if (noteAreaButton && noteArea) {
      if (isOpen) {
        this.renderer.addClass(noteAreaButton, 'hide');
        this.renderer.removeClass(noteArea, 'hide');
      } else {
        this.renderer.removeClass(noteAreaButton, 'hide');
        this.renderer.addClass(noteArea, 'hide');
      }
    }
  }

  addTextToNoteAd(index: number, text: string): void {
    const noteArea = document.getElementById(
      `ad-note-area-text${index}`
    ) as HTMLTextAreaElement;

    if (noteArea) {
      const existingText = noteArea.value || '';
      noteArea.value = existingText + (existingText ? ' ' : '') + text;
    } else {
      console.warn(`Textarea with id "ad-note-area-text${index}" not found.`);
    }
  }

  clearTextFromNoteAd(index: number, adId: number): void {
    if (this.retrieveNoteAd(adId) === '') {
      const noteArea = document.getElementById(
        `ad-note-area-text${index}`
      ) as HTMLTextAreaElement;
      if (noteArea) {
        noteArea.value = '';
      }
    }
  }

  retrieveNoteAd(adID: number): string {
    return this.userNotes?.find((note) => note.adID === adID)?.note || '';
  }

  updateNoteAd(adID: number, note: string): void {
    this.authService.postAdNoteToUser(adID, note);
  }

  ngOnInit() {
    this.authService.isFavoritesAdIsOpen(true);
    this.authService.getUserNotes();
    this.authService.userNotes.subscribe((notes) => {
      this.userNotes = notes;
    });
  }

  ngOnDestroy() {
    this.authService.isFavoritesAdIsOpen(false);
  }

  displayAdOptions(event: any, index: number) {
    let divTarget = document.getElementById(
      'ad-date-update' + index.toString()
    );

    let divTarget2 = document.getElementById(
      'new-window-content' + index.toString()
    );

    if (event.type === 'mouseenter' && divTarget) {
      divTarget.innerHTML = '';
      setTimeout(() => {
        divTarget.innerHTML = 'לחצו לפרטים';
      }, 100);
      this.renderer.removeClass(divTarget, 'decrease-opacity');
      this.renderer.addClass(divTarget, 'orange-font');
      this.renderer.addClass(divTarget, 'font500');
      this.renderer.addClass(divTarget2, 'black-color');
    } else if (event.type === 'mouseleave' && divTarget) {
      this.renderer.removeClass(divTarget, 'orange-font');
      this.renderer.removeClass(divTarget, 'font500');
      this.renderer.removeClass(divTarget2, 'black-color');

      divTarget.innerHTML = 'עודכן היום';
    }
  }

  increaseOpacity(event: any, index: number) {
    let divTarget1 = document.getElementById(
      'new-window-icon' + index.toString()
    );
    let divTarget2 = document.getElementById(
      'new-window-content' + index.toString()
    );

    if (event.type === 'mouseenter' && divTarget2) {
      this.renderer.addClass(divTarget2, 'increase-opacity');
      this.renderer.addClass(divTarget1, 'darker-icon');
    } else if (event.type === 'mouseleave' && divTarget2) {
      this.renderer.removeClass(divTarget2, 'increase-opacity');
      this.renderer.removeClass(divTarget1, 'darker-icon');
    }
  }

  zoomInImage(event: any, index: number) {
    let divTarget = document.getElementById('ad-image' + index.toString());

    if (event.type === 'mouseenter' && divTarget) {
      this.renderer.addClass(divTarget, 'zoom');
    }
  }
  zoomOutImage(event: any, index: number) {
    let divTarget = document.getElementById('ad-image' + index.toString());

    if (event.type === 'mouseleave' && divTarget) {
      this.renderer.removeClass(divTarget, 'zoom');
    }
  }
}
