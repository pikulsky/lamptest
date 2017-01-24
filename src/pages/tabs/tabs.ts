import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {ScanPage} from "../scan/scan";
import {LampsPage} from "../lamps/lamps";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabScanRoot: any = ScanPage;
  tabAboutRoot: any = AboutPage;
  tabLampsRoot: any = LampsPage;

  constructor() {

  }
}
