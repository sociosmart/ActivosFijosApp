import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaActivoPage } from './alta-activo.page';

const routes: Routes = [
  {
    path: '',
    component: AltaActivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaActivoPageRoutingModule {}
