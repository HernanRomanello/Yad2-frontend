import { Component } from '@angular/core';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css',
})
export class StatisticComponent {
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
}
