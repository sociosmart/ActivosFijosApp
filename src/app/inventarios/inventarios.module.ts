import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventariosPageRoutingModule } from './inventarios-routing.module';

import { InventariosPage } from './inventarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventariosPageRoutingModule
  ],
  declarations: [InventariosPage]
})
export class InventariosPageModule {}
