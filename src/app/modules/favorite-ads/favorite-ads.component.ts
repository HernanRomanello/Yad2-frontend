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

    if (event.type === 'mouseenter' && divTarget) {
      divTarget.innerHTML = 'לחצו לפרטים';
      this.renderer.removeClass(divTarget, 'decrease-opacity');
      this.renderer.addClass(divTarget, 'orange-font');
      this.renderer.addClass(divTarget, 'font500');
    } else if (event.type === 'mouseleave' && divTarget) {
      this.renderer.removeClass(divTarget, 'orange-font');
      this.renderer.removeClass(divTarget, 'font500');

      divTarget.innerHTML = 'עודכן היום';
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
