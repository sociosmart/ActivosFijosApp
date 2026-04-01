import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LealtadPage } from './lealtad.page';

const routes: Routes = [
  {
    path: '',
    component: LealtadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LealtadPageRoutingModule {}
