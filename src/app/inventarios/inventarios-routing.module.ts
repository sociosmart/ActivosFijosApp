import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventariosPage } from './inventarios.page';

const routes: Routes = [
  {
    path: '',
    component: InventariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventariosPageRoutingModule {}
