import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioCapturaPage } from './inventario-captura.page';

const routes: Routes = [
  {
    path: '',
    component: InventarioCapturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioCapturaPageRoutingModule {}
