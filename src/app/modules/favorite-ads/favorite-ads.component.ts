import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { UserNoteModel } from '../../shared/models/UserNoteModel';

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
      if (existingText.length + text.length <= 200) {
        noteArea.value = existingText + (existingText ? ' ' : '') + text;
      }
    } else {
      console.warn(`Textarea with id "ad-note-area-text${index}" not found.`);
    }
  }

  // formatNoteAd(note: string): string {
  //   let editedNote = note.replace(/\s+/g, ' ').trim();

  //   if (editedNote.length === 99) {
  //     return (editedNote = editedNote.slice(0, 99));
  //   }
  //   if (editedNote.length > 99) {
  //     return (editedNote = editedNote.slice(0, 98) + '...');
  //   }

  //   return editedNote;
  // }

  formatNoteAd(note: string, maxWidth: number, text: any): string {
    // let text = '';
    // console.log('span.offsetWidth:', span.offsetWidth.valueOf());
    console.log('textWidth                  :', text.offsetWidth + note);

    return text + '...';
  }

  // formatNoteAd(note: string, maxWidth: number): string {
  //   // Create a temporary span element for measuring text width
  //   const span = document.createElement('span');

  //   // Set the font to match your application's font style
  //   span.style.font = '16px Rubik, sans-serif'; // Adjust the font size and family as per your UI

  //   // Add a space before the text
  //   span.textContent = ' ' + note; // Add leading space

  //   // Append span to the body (it won't be visible)
  //   document.body.appendChild(span);

  //   // Measure the width of the text inside the span
  //   const textWidth = span.offsetWidth;
  //   console.log('Text width with space:', textWidth);

  //   // Remove the span from the DOM after measuring the width
  //   document.body.removeChild(span);

  //   // Check if the text fits within the maxWidth
  //   if (textWidth <= maxWidth) {
  //     return ' ' + note; // Return the note with leading space if no trimming is needed
  //   }

  //   // Dynamically trim the text until it fits within the maxWidth
  //   let editedNote = ' ' + note;
  //   while (true) {
  //     // Append ellipsis and measure width
  //     const widthWithEllipsis = (editedNote + '...').length;
  //     span.textContent = editedNote + '...';
  //     if (span.offsetWidth <= maxWidth) {
  //       break;
  //     }
  //     editedNote = editedNote.slice(0, -1); // Trim one character
  //   }

  //   // Return the trimmed text with ellipsis
  //   return editedNote + '...';
  // }

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
    this.authService.getUserNotes();
    this.authService.postAdNoteToUser(adID, note);
    this.authService.getUserNotes();
  }

  ngOnInit() {
    this.authService.isFavoritesAdIsOpen(true);

    this.authService.getUserNotes();

    this.authService.userNotes.subscribe((notes) => {
      this.userNotes = notes;
    });
  }

  updateUserNote(adID: number, newNote: string): void {
    const userNote = this.userNotes?.find((note) => note.adID === adID);
    if (userNote) {
      userNote.note = newNote;
    } else {
      console.warn(`No note found for adID: ${adID}`);
    }
  }

  countLetters() {
    alert('countLetters');
  }

  ngOnDestroy() {
    this.authService.isFavoritesAdIsOpen(false);
    this.authService.userNotes.unsubscribe();
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
