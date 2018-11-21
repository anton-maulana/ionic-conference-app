import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
  styleUrls: ['./add-product.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductPage implements AfterViewInit {
	tracks: {name: string, isChecked: boolean}[] = [];
	currentImage: string = "";
	model: any = {};
	

	constructor(
		public modalCtrl: ModalController,
		private camera: Camera,
		private webview: WebView,
		private file: File,
		
	) {
		
	}

	ngAfterViewInit() {	

	}

	

	resetFilters() {
		this.tracks.forEach(track => {
		track.isChecked = true;
		});
	}

	submitProduct() {
		this.dismiss(this.model);
	}

	dismiss(data?: any) {
		if(data && this.model.file_name != "")
			this.removeImage();
		this.modalCtrl.dismiss(data);
	}

	removeImage(){
		let path = this.model.file_name
		let hostPath = path.substring(0,path.lastIndexOf('/')+1);
		let fileName = path.substring(path.lastIndexOf('/')+1);

		if(this.file.checkFile(hostPath,fileName)){
			this.file.removeFile(hostPath, fileName);
		}
	}

	openCamera(){
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: true
		}
		  
		this.camera.getPicture(options).then((imageData) => {
			this.model['file_name'] = imageData;
			this.currentImage = this.webview.convertFileSrc(imageData)
		  }, (err) => {
			  //handle mirror disini
		});
	}
	  
}
