import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { Base64 } from '@ionic-native/base64';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { Camera, CameraOptions } from '@ionic-native/camera';



@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
  styleUrls: ['./add-product.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductPage implements AfterViewInit {
  
  tracks: {name: string, isChecked: boolean}[] = [];
  public bs64Image : string='';

  constructor(
    public confData: ConferenceData,
	public modalCtrl: ModalController,
	private camera: Camera
  ) { }

  

  // TODO use the ionViewDidEnter event
	ngAfterViewInit() {
		// passed in array of track names that should be excluded (unchecked)
		const excludedTrackNames = []; // this.navParams.data.excludedTracks;

		this.confData.getTracks().subscribe((trackNames: string[]) => {
			trackNames.forEach(trackName => {
				this.tracks.push({
				name: trackName,
				isChecked: (excludedTrackNames.indexOf(trackName) === -1)
				});
			});
		});
	}

	resetFilters() {
		// reset all of the toggles to be checked
		this.tracks.forEach(track => {
		track.isChecked = true;
		});
	}

	applyFilters() {
		// Pass back a new array of track names to exclude
		const excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
		this.dismiss(excludedTrackNames);
	}

	dismiss(data?: any) {
		// using the injected ModalController this page
		// can "dismiss" itself and pass back data
		this.modalCtrl.dismiss(data);
	}

	openCamera(){
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}
		  
		this.camera.getPicture(options).then((imageData) => {
		   // imageData is either a base64 encoded string or a file URI
		   // If it's base64 (DATA_URL):
		   	this.bs64Image = imageData;
			//let cameraImageSelector = document.getElementById('image-preview');
			//icameraImageSelector.setAttribute('src', this.bs64Image);
		  }, (err) => {
		   // Handle error
		});
	}
	  
}
