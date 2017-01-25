import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

declare var data: any;
declare var moment: any;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  totalLamps: number;
  latestUpdate: any;

  constructor(public navCtrl: NavController) {
    this.totalLamps = 0;
    this.latestUpdate = moment('1970-01-01');

    for (var upc in data) {
      if (data.hasOwnProperty(upc)) {
        this.totalLamps++;
        let testDate = moment(data[upc].test_date, 'DD.MM.YYYY');
        if (testDate > this.latestUpdate) {
          this.latestUpdate = testDate;
        }
      }
    }

    this.latestUpdate = this.latestUpdate.format('Do MMMM, YYYY');
  }

}
