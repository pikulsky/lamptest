import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LampPage } from '../lamp/lamp';
import { LampData } from '../../providers/lamp-data';
import { FormControl } from '@angular/forms';
import { Splashscreen } from 'ionic-native';
import 'rxjs/add/operator/debounceTime';
import http from 'http';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  public lamps: any[] = [];

  public isSearchInProgress: boolean = false;
  public searchTerm: string = '';
  public searchControl: FormControl;

  constructor(public navCtrl: NavController, private lampData: LampData) {
    this.lamps = this.lampData.getList(null);

    this.searchControl = new FormControl();
  }


  checkURL(url) {
    const options = {
      method: 'HEAD',
      host: 'lamptest.ru',
      path: url,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
    http.get(options, function(response) {
      response.on('data', function (chunk) {
        // discard data if any
      });
      response.on('end', function () {
        //this.checkStatusCode(url, response.statusCode);
        if (response.statusCode !== 200) {
          console.log('Failed ' + response.statusCode + ' ' + url);
          //process.exit();
        }
      });
    });
  }

  onSearchInput() {
    this.isSearchInProgress = true;
  }

  ionViewDidLoad() {
    this.searchControl.valueChanges.debounceTime(200).subscribe(search => {
      this.updateLampsList(search);
      this.isSearchInProgress = false;
    });
  }

  ionViewDidEnter() {
    Splashscreen.hide();
  }

  lampClicked(upc: string, offset: number) {
    this.navCtrl.push(LampPage, {upc: upc, offset: offset});
  }

  private updateLampsList(searchString: string) {
    this.lamps = this.lampData.getList(searchString);
  }
}
