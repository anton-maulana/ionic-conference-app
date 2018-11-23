import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { AddProductPage } from '../add-product/add-product';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { DatabaseProvider } from '../../providers/database';
import { WebView } from '@ionic-native/ionic-webview/ngx';

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
    products: any = [];
    sourceProducts: any = [];

    constructor(
        public alertCtrl: AlertController,
        public confData: ConferenceData,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public router: Router,
        public toastCtrl: ToastController,
        public user: UserData,
        private databaseprovider: DatabaseProvider,
        private webview: WebView
    ) {
        this.databaseprovider.getDatabaseState().subscribe(rdy => {
            if (rdy) {
                this.loadProductsData();
            }
        })
    }

    loadProductsData() {
        this.databaseprovider.getAllProducts().then(data => {
            data = data.map(c => {
                c.price = this.rupiahCurrency(c.price);
                return c;
            })
            this.sourceProducts = data;
            this.products = data;

        })
    }

    ionViewWillEnter() {
    }

    async openAddProduct() {
        const modal = await this.modalCtrl.create({
            component: AddProductPage,
            componentProps: { id: null, action: 'insert' },

        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            let product = {
                name: data.name,
                price: data.price,
                code: data.code,
                desc: data.desc,
                date_created: this.getNowDateTime(),
                date_modified: this.getNowDateTime()
            }

            let res = await this.databaseprovider.insert('products', product);
            this.loadProductsData();
        }
    }

    goToSessionDetail(sessionData: any) {
        this.router.navigateByUrl(`app/tabs/(schedule:session/${sessionData.id})`);
    }

    getNowDateTime(): string {
        let x = new Date();
        return x.getFullYear() + '-' + x.getMonth() + '-' + x.getDate() + ' ' + x.getHours() + ':' + x.getMinutes();
    }

    rupiahCurrency(value) {
        if (isNaN(value))
            return;
        if (!value)
            value = 0;
        let stringValue = value.toFixed(2);
        let split = stringValue.split('.');
        let remain = split[0].length % 3;
        let rupiah = split[0].substr(0, remain);
        let thousand = split[0].substr(remain).match(/\d{1,3}/gi);

        if (thousand) {
            let separator = remain ? '.' : '';
            rupiah += separator + thousand.join('.');
        }
        return split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    }

    filterProducts(){
        this.queryText = this.queryText ? this.queryText : '';
        this.products = this.sourceProducts.filter(c => c.name && c.name.startsWith(this.queryText.toLowerCase()))
    }

    async updateProduct(id){
        const modal = await this.modalCtrl.create({
            component: AddProductPage,
            componentProps: { id: id, action: 'update' }
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            if(data.action == 'delete'){
                let res = await this.databaseprovider.delete('products', data.id);   
            } else {
                let product = {
                    name: data.name,
                    price: data.price,
                    desc: data.desc,
                    code: data.code,
                    date_modified: this.getNowDateTime()
                }
                let res = await this.databaseprovider.update('products', product, data.id);            
            }
            this.loadProductsData();
        }

    }

}
