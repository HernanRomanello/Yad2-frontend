import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementService } from '../../services/advertisement.service';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { catchError } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.css',
})
export class ImagesComponent implements OnInit, OnDestroy {
  advertisement!: AdvertisementsModel;

  ngOnInit() {
    this.navigationService.isUserImagesIsOpen.set(true);
  }

  ngOnDestroy() {
    this.navigationService.isUserImagesIsOpen.set(false);
  }
  constructor(
    private route: ActivatedRoute,
    private AdvertisementsService: AdvertisementService,
    private navigationService: NavigationService
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
