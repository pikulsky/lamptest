import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {ScanPage} from "../scan/scan";
import {ListPage} from "../list/list";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabScanRoot: any = ScanPage;
  tabAboutRoot: any = AboutPage;
  tabListRoot: any = ListPage;

  constructor() {

  }
}
