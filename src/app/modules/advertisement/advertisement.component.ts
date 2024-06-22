import { Component, inject } from '@angular/core';
import { AdvertisementService } from '../../services/advertisement.service';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css',
})
export class AdvertisementComponent {
  advertisement!: AdvertisementsModel;
  entryDate: string = '';
  constructor(
    private route: ActivatedRoute,
    private AdvertisementsService: AdvertisementService
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
            const date = new Date(this.advertisement.entryDate);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);
            this.entryDate = `${day}/${month}/${year}`;
          });
      }
    });
  }

  fillApartmentCondition(condition: boolean): string {
    if (condition) {
      return 'text';
    } else {
      return 'light-text';
    }
  }
}
