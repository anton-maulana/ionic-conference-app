import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { AddProductPage } from '../add-product/add-product';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  styleUrls: ['./products.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsPage {
  // Gets a reference to the list element
  @ViewChild('productsList') productsList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public toastCtrl: ToastController,
    public user: UserData,
  ) { }

  ionViewWillEnter() {
  }

  async openAddProduct() {
    const modal = await this.modalCtrl.create({
      component: AddProductPage,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      //this.updateSchedule();
    }
  }

  goToSessionDetail(sessionData: any) {
    // go to the session detail page
    // and pass in the session data
    this.router.navigateByUrl(`app/tabs/(schedule:session/${sessionData.id})`);
  }
}
