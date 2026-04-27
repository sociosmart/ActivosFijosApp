import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioDetallePage } from './inventario-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: InventarioDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioDetallePageRoutingModule {}
