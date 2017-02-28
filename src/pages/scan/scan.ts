import { Component } from '@angular/core';

import {Platform, ToastController, PopoverController, NavController} from 'ionic-angular';
import {LampPage} from '../lamp/lamp';
import {LampData} from '../../providers/lamp-data';
import {LampsSelectorPage} from "../lamps-selector/lamps-selector";

declare let cordova: any;

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(
    private platform: Platform,
    public lampData: LampData,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
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
                  // Present a popover with a list of found lamps
                  let lampsSelector = ctrl.popoverCtrl.create(LampsSelectorPage, {lamps: lamps});
                  lampsSelector.onDidDismiss((selected) => {
                    ctrl.navCtrl.push(LampPage, {upc: selected.upc, offset: selected.offset});
                  });
                  lampsSelector.present();
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
            if (error === 'Illegal access') {
              return ctrl.insufficientPermissions();
            }

            // Unknown error
            console.log('Barcode scanner error: ' + JSON.stringify(error));

            // Switch to lamps list
            ctrl.navCtrl.parent.select(2);

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

  private insufficientPermissions() {
    // Switch to lamps tab
    this.navCtrl.parent.select(2);

    let toast = this.toastCtrl.create({
      message: 'Для работы сканера штрих-кодов необходим доступ к камере',
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'X'
    });

    toast.present();
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
