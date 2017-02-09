import { Component } from '@angular/core';

import {Platform, ToastController, NavController} from 'ionic-angular';
import {LampPage} from '../lamp/lamp';
import {LampData} from "../../providers/lamp-data";

declare var cordova: any;

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(
    private platform: Platform,
    public lampData: LampData,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {

  }

  scan() {
    let ctrl = this;

    this.platform.ready()
      .then(function () {
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result && result.text && !result.cancelled) {
              if (ctrl.lampData.isLampAvailable(result.text)) {
                ctrl.navCtrl.push(LampPage, {upc: result.text});
              }
              else {
                let toast = ctrl.toastCtrl.create({
                  message: 'Лампа с таким штрих-кодом не найдена',
                  position: 'middle',
                  showCloseButton: true,
                  closeButtonText: 'X'
                });

                toast.onDidDismiss(() => {
                  ctrl.navCtrl.pop();
                });

                toast.present();
              }
            }
          },
          function (error) {
            console.log('Error!');
            console.log(JSON.stringify(error));

            let toast = ctrl.toastCtrl.create({
              message: 'Ошибка сканирования штрих-кода',
              position: 'middle',
              showCloseButton: true,
              closeButtonText: 'X'
            });

            toast.onDidDismiss(() => {
              ctrl.navCtrl.pop();
            });

            toast.present();
          }
        );
      });
  }

}
