import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LampPage} from '../lamp/lamp';
import {LampData} from "../../providers/lamp-data";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  public lamps: any[] = [];

  public searchForm = this.formBuilder.group({
    searchString: ["", Validators.required]
  });

  constructor(public navCtrl: NavController, private lampData: LampData, public formBuilder: FormBuilder) {
    this.lamps = this.lampData.getList(null);
  }

  lampClicked(upc: string) {
    this.navCtrl.push(LampPage, {upc: upc});
  }

  search() {
    this.updateLampsList(this.searchForm.value.searchString);
  }

  private updateLampsList(searchString: string) {
    this.lamps = this.lampData.getList(searchString);
  }
}
