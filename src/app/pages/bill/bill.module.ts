import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BillPage } from './bill';
import { BillPageRoutingModule } from './bill-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BillPageRoutingModule
  ],
  declarations: [BillPage],
})
export class BillModule {}
