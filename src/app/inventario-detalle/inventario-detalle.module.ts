import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioDetallePageRoutingModule } from './inventario-detalle-routing.module';

import { InventarioDetallePage } from './inventario-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioDetallePageRoutingModule
  ],
  declarations: [InventarioDetallePage]
})
export class InventarioDetallePageModule {}
