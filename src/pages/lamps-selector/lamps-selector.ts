import {Component} from '@angular/core';

import {ViewController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-lamps-selector',
  templateUrl: 'lamps-selector.html'
})
export class LampsSelectorPage {

  lamps: any;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    this.lamps = this.navParams.data.lamps;
  }

  close(upc: number, offset: number) {
    this.viewCtrl.dismiss({
      upc: upc,
      offset: offset
    });
  }

}
