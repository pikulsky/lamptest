import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LampPage} from '../lamp/lamp';
import {LampData} from "../../providers/lamp-data";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  lamps: any[] = [];

  constructor(public navCtrl: NavController, public lampData: LampData) {
    this.lamps = lampData.getList();
  }

  lampClicked(upc: string) {
    this.navCtrl.push(LampPage, {upc: upc});
  }

}
