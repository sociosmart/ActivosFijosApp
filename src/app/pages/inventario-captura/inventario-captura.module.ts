import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioCapturaPageRoutingModule } from './inventario-captura-routing.module';

import { InventarioCapturaPage } from './inventario-captura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioCapturaPageRoutingModule
  ],
  declarations: [InventarioCapturaPage]
})
export class InventarioCapturaPageModule {}
