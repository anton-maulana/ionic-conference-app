import { AfterViewInit, Component, ViewEncapsulation, Input } from '@angular/core';
import { ModalController, NavParams, AlertController} from '@ionic/angular';
import { DatabaseProvider } from '../../providers/database';


@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
  styleUrls: ['./add-product.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductPage implements AfterViewInit {
	currentImage: string = "";
	model: any = {};
	idProduct: any;
	action: string;
	isDelete: boolean;
	constructor(
		public modalCtrl: ModalController,
		private navParams: NavParams,
		private databaseProvider: DatabaseProvider,
		private alertController: AlertController
	) {
		
	}

	ngAfterViewInit() {	
		this.idProduct = this.navParams.data.id;	
		this.action = this.navParams.data.action;

		if(this.idProduct){
			this.databaseProvider.get('products', this.idProduct).then(data => {
				this.model = data.rows.item(0);
				this.model['action'] = this.action;
			})
		}
	}

	submitProduct() {
		this.dismiss(this.model);
	}

	dismiss(data?: any) {
		this.modalCtrl.dismiss(data);
	}

	async showAlertConfirmation(){
		let me = this;
		const alert = await this.alertController.create({
			header: 'Konfirmasi!',
			message: '<strong>Apakah Anda Yakin Menghapus Product Ini</strong>!!!',
			buttons: [
			{
				text: 'Batal',
				role: 'cancel',
				cssClass: 'secondary',
				handler: (a) => {
					me.isDelete = false;
				}
			}, {
				text: 'Hapus',
				handler: (a) => {
					me.isDelete = true;
				}
			}
			]
		});
	
		await alert.present();		
		await alert.onDidDismiss().then(data => {
			if(me.isDelete){
				me.model = {
					action: 'delete',
					id: me.idProduct
				}
				me.dismiss(me.model);
			}
		});		
	} 
}
