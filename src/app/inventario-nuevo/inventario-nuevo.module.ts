import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioNuevoPageRoutingModule } from './inventario-nuevo-routing.module';

import { InventarioNuevoPage } from './inventario-nuevo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioNuevoPageRoutingModule
  ],
  declarations: [InventarioNuevoPage]
})
export class InventarioNuevoPageModule {}
