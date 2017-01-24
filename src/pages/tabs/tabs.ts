import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabHomeRoot: any = HomePage;
  tabAboutRoot: any = AboutPage;
  tabContactRoot: any = ContactPage;

  constructor() {

  }
}
