import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleCargaPage } from './detalle-carga.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCargaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCargaPageRoutingModule {}
