import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { UserModel } from '../../shared/models/UserModel';
import { NavigationService } from '../../services/navigation.service';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
// import { UserModel } from '../../app.component.css';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',

  //  styleUrls: [
  //   './user-area.component.css',
  //   '../../real-estate/real-estate-results/real-estate-results.component.css',
  //    './sidebar.component.css'
  // ],
  styleUrls: [
    // '../real-estate/real-estate-results/real-estate-results.component.css',
    // '../../app.component.css',
    './sidebar.component.css',
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  authService = inject(AuthService);
  userName: string = '';
  userLastname: string = '';
  UserEmailAddress: string = '';
  navigate = inject(NavigationService);
  nameOfComponent: string = '';
  @Input() theme: 'dark' | 'light' = 'light';
  isDarkModes: boolean = true;
  searchService = inject(SearchService);
  countFavoriteAds = 0;

  ngOnInit(): void {
    this.authService.user.subscribe((user: UserModel | null | undefined) => {
      this.userName = user?.name || '';
      this.userLastname = user?.lastName || '';
      this.UserEmailAddress = user?.email || '';
    });

    this.authService.UserFavoriteAdvertisements.subscribe((ads) => {
      this.countFavoriteAds = ads.length;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          this.router.url.includes('profile') ||
          this.router.url.includes('favorites') ||
          this.router.url.includes('last-searches')
        ) {
          this.theme = 'dark';
          this.isDarkModes = true;
        } else {
          this.theme = 'light';
          this.isDarkModes = false;
        }

        this.nameOfComponent = this.router.url;
      }
    });
  }

  ngOnDestroy(): void {
    this.authService.user.unsubscribe();
    this.authService.UserFavoriteAdvertisements.unsubscribe;
  }

  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();

  closeSidebar() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeSidebar();
  }
}
