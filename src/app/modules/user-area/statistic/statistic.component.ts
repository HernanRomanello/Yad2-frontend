import { Component } from '@angular/core';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css',
})
export class StatisticComponent {
  watchedAdisChecked = true;
  saveAdisChecked = true;
  clickedAdisChecked = true;
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
      event.target.id !== 'blue-decoration'
    ) {
      this.dropDownIsVisible = false;
    }
  }
}
