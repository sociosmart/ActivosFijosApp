import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCargaPageRoutingModule } from './detalle-carga-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DetalleCargaPage } from './detalle-carga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCargaPageRoutingModule
  ],
  declarations: [DetalleCargaPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DetalleCargaPageModule {}
