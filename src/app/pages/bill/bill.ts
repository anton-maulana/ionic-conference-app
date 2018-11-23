import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'bill',
  templateUrl: 'bill.html',
  styleUrls: ['./bill.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillPage {
  speakers: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public router: Router
  ) {}


}
