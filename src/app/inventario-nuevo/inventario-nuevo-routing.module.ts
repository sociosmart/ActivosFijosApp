import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioNuevoPage } from './inventario-nuevo.page';

const routes: Routes = [
  {
    path: '',
    component: InventarioNuevoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioNuevoPageRoutingModule {}
