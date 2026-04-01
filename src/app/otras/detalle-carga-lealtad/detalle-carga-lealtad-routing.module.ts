import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleCargaLealtadPage } from './detalle-carga-lealtad.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCargaLealtadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCargaLealtadPageRoutingModule {}
