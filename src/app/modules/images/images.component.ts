import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementService } from '../../services/advertisement.service';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { catchError } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.css',
})
export class ImagesComponent implements OnInit, OnDestroy {
  advertisement!: AdvertisementsModel;
  clickedIndex: number[] = [-1, -1, -1];

  toggleFavoriteAd(index: number): void {
    if (this.clickedIndex[index] === -1) {
      this.clickedIndex[index] = index;
    } else {
      this.clickedIndex[index] = -1;
    }
  }
  setImageSize(index: number): boolean {
    if (index === 0 || index % 3 === 0) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    // this.navigationService.isUserImagesIsOpen.set(true);
  }

  ngOnDestroy() {
    // this.navigationService.isUserImagesIsOpen.set(false);
  }
  constructor(
    private route: ActivatedRoute,
    private AdvertisementsService: AdvertisementService,
    private navigationService: NavigationService,
    public searchService: SearchService
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.AdvertisementsService.GetAdvertisementById(+params['id'])
          .pipe(
            catchError((e) => {
              console.log(e);
              return [];
            })
          )
          .subscribe((response) => {
            this.advertisement = response;
          });
      }
    });
  }
}
