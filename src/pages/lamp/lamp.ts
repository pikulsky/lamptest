import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LampData} from "../../providers/lamp-data";

@Component({
  selector: 'page-lamp',
  templateUrl: 'lamp.html'
})
export class LampPage {

  public lamp: any;

  constructor(navCtrl: NavController, navParams: NavParams, lampData: LampData) {
    let upc = navParams.get('upc');

    this.lamp = lampData.getLamp(upc);
  }

}
