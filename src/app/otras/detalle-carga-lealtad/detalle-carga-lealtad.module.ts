import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCargaLealtadPageRoutingModule } from './detalle-carga-lealtad-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DetalleCargaLealtadPage } from './detalle-carga-lealtad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCargaLealtadPageRoutingModule
  ],
  declarations: [DetalleCargaLealtadPage],
   schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DetalleCargaLealtadPageModule {}
