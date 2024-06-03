import { Component, inject } from '@angular/core';
import { AdvertisementService } from '../../services/advertisement.service';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css',
})
export class AdvertisementComponent {
  advertisement!: AdvertisementsModel;
  constructor(
    private route: ActivatedRoute,
    private AdvertisementsService: AdvertisementService
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.AdvertisementsService.GetAdvertisementById(
          +params['id']
        ).subscribe((response) => {
          this.advertisement = response;
          console.log(this.advertisement);
        });
      }
    });
  }
}
