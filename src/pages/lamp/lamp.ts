import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LampData } from '../../providers/lamp-data';
import { Lamp } from '../../models/lamp';

@Component({
  selector: 'page-lamp',
  templateUrl: 'lamp.html'
})
export class LampPage {

  public lamp: Lamp;

  constructor(navCtrl: NavController, navParams: NavParams, lampData: LampData) {
    let upc = navParams.get('upc');
    let offset = navParams.get('offset');

    this.lamp = lampData.getLamp(upc, offset);
  }

}
