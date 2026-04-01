import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RascaYGanaPageRoutingModule } from './rasca-ygana-routing.module';

import { RascaYGanaPage } from './rasca-ygana.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RascaYGanaPageRoutingModule
  ],
  declarations: [RascaYGanaPage]
})
export class RascaYGanaPageModule {}
