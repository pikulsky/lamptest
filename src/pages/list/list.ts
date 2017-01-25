import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

declare var data: any;

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  lamps: any[] = [];

  constructor(public navCtrl: NavController) {

    for (let upc in data) {
      if (data.hasOwnProperty(upc)) {
        let title = data[upc].brand + ' ' + data[upc].model;
        if (title) {
          this.lamps.push({
            title: title,
            upc: upc,
            normalizedTitle: title.toLowerCase()
          });
        }
      }
    }
  }

  lampClicked(upc: string) {
    console.log(upc);
  }

}
