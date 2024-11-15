import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-favorite-ads',
  templateUrl: './favorite-ads.component.html',
  styleUrl: './favorite-ads.component.css',
})
export class FavoriteAdsComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService, private renderer: Renderer2) {}

  ngOnInit() {
    this.authService.isFavoritesAdIsOpen(true);
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
