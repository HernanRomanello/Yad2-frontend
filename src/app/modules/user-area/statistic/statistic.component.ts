import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/user/auth.service';
import { AdvertisementModelStatistic } from '../../../shared/models/AdvertisementModelStatistic';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css',
})
export class StatisticComponent implements OnInit {
  watchedAdisChecked = true;
  watchedAdisCheckedFrame = false;
  saveAdisChecked = true;
  saveAdisCheckedFrame = false;
  clickedAdisChecked = true;
  clickedAdisCheckedFrame = false;
  vaerticalLineIsVisible = false;
  dropDownOptions: string[] = [
    '7 ימים אחרונים',
    '14 ימים אחרונים',
    '30 ימים אחרונים',
    '90 ימים אחרונים',
  ];
  dropDownValue = this.dropDownOptions[0];
  dropDownIsVisible = false;
  blueDecorationIsVisible = false;
  // userStatistics: BehaviorSubject<AdvertisementModelStatistic>;
  userStatistics: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userStatistics = this.authService.UserAdvertisementsStatistics.value;
    console.log(this.userStatistics);
    // console.log(this.authService.UserAdvertisementsStatistics.value);
  }

  closeDropDown(event: any) {
    if (
      event.target.id !== 'dropdown-btn' &&
      event.target.id !== 'dropdown-btn-text' &&
      event.target.id !== 'blue-decoration' &&
      event.target.id !== 'dropdown-btn-text-value' &&
      event.target.id !== 'arrow-down'
    ) {
      this.dropDownIsVisible = false;
      this.blueDecorationIsVisible = false;
    }
  }

  setBlueFrameToCheckedInput(
    clickedAdisCheckedFrame: boolean,
    saveAdisCheckedFrame: boolean,
    watchedAdisCheckedFrame: boolean
  ) {
    this.clickedAdisCheckedFrame = clickedAdisCheckedFrame;
    this.saveAdisCheckedFrame = saveAdisCheckedFrame;
    this.watchedAdisCheckedFrame = watchedAdisCheckedFrame;
  }

  removeBlueFrameFromCheckedInputs(event: any) {
    const className = event.target.className;
    if (!className.includes('check-input')) {
      this.setBlueFrameToCheckedInput(false, false, false);
    }
  }
}
