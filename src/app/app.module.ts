import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {LampTest} from './app.component';
import {AboutPage} from '../pages/about/about';
import {TabsPage} from '../pages/tabs/tabs';
import {ScanPage} from "../pages/scan/scan";
import {LampsPage} from "../pages/lamps/lamps";

@NgModule({
  declarations: [
    LampTest,
    AboutPage,
    LampsPage,
    ScanPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(LampTest)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LampTest,
    AboutPage,
    LampsPage,
    ScanPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
