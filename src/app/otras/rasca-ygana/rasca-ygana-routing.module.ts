import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RascaYGanaPage } from './rasca-ygana.page';

const routes: Routes = [
  {
    path: '',
    component: RascaYGanaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RascaYGanaPageRoutingModule {}
