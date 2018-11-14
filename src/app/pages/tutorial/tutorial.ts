import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, Slides } from '@ionic/angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TutorialPage {
  showSkip = true;

  @ViewChild('slides') slides: Slides;

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage
  ) {}

  ngOnInit() {
    this.router
    .navigateByUrl('/app/tabs/(products:products)')
    .then(() => this.storage.set('ion_did_tutorial', 'true'));
  }

  startApp() {
    this.router
      .navigateByUrl('/app/tabs/(products:products)')
      .then(() => this.storage.set('ion_did_tutorial', 'true'));
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  ionViewWillEnter() {
    this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/app/tabs/(products:products)');
      }
    });

    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
