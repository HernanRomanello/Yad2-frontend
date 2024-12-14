import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementService } from '../../services/advertisement.service';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { AuthService } from '../../services/user/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.css',
})
export class ImagesComponent {
  advertisement!: AdvertisementsModel;
  constructor(
    private route: ActivatedRoute,
    private AdvertisementsService: AdvertisementService,
    public authSerivce: AuthService,
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
            console.log(this.advertisement);
          });
      }
    });
  }
}
