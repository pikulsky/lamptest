import { Component } from '@angular/core';

import { Platform, NavController } from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(private platform: Platform, public navCtrl: NavController) {

  }

  scan() {
    this.platform.ready()
      .then(function () {
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            console.log('Success!!');
            console.log(JSON.stringify(result));
          },
          function (error) {
            console.log('Error!');
            console.log(JSON.stringify(error));
          }
        );
      });
  }

}
