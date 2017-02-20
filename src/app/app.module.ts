import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {LampTest} from './app.component';
import {AboutPage} from '../pages/about/about';
import {TabsPage} from '../pages/tabs/tabs';
import {ScanPage} from '../pages/scan/scan';
import {ListPage} from '../pages/list/list';
import {LampPage} from '../pages/lamp/lamp';
import {LampData} from '../providers/lamp-data';
import {LampsSelectorPage} from "../pages/lamps-selector/lamps-selector";

@NgModule({
  declarations: [
    LampTest,
    AboutPage,
    ListPage,
    ScanPage,
    LampPage,
    TabsPage,
    LampsSelectorPage
  ],
  imports: [
    IonicModule.forRoot(LampTest)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LampTest,
    AboutPage,
    ListPage,
    ScanPage,
    LampPage,
    TabsPage,
    LampsSelectorPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, LampData]
})
export class AppModule {}
