import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillPage } from './bill';
const routes: Routes = [
  {
    path: '',
    component: BillPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillPageRoutingModule {}
