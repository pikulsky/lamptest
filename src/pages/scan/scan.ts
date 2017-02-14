import { Component } from '@angular/core';

import {Platform, ToastController, NavController} from 'ionic-angular';
import {LampPage} from '../lamp/lamp';
import {LampData} from '../../providers/lamp-data';

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

  ionViewWillEnter() {
    this.scan();
  }

  scan() {
    let ctrl = this;

    this.platform.ready()
      .then(function () {
        if (typeof cordova === 'undefined' || !cordova.plugins || !cordova.plugins.barcodeScanner) {
          return ctrl.barcodeScannerNotAvailable();
        }

        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result && result.text && !result.cancelled) {
              if (ctrl.lampData.areLampsAvailableByUpc(result.text)) {
                let lamps = ctrl.lampData.getLampsByUpc(result.text);
                if (lamps.length === 1) {
                  ctrl.navCtrl.push(LampPage, {upc: result.text, offset: 0});
                }
                else {
                  // TODO Show list with found lamps
                  ctrl.navCtrl.push(LampPage, {upc: result.text, offset: 0});
                }
              }
              else {
                // Switch to lamps tab
                this.navCtrl.parent.select(2);

                let toast = ctrl.toastCtrl.create({
                  message: 'Лампа с таким штрих-кодом не найдена',
                  position: 'middle',
                  showCloseButton: true,
                  closeButtonText: 'X'
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

            toast.present();
          }
        );
      });
  }

  private barcodeScannerNotAvailable() {
    // Switch to lamps tab
    this.navCtrl.parent.select(2);

    let toast = this.toastCtrl.create({
      message: 'Сканер штрих-кодов не доступен на данной платформе',
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'X'
    });

    toast.present();
  }

}
