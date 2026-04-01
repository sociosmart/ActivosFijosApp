import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaActivoPageRoutingModule } from './alta-activo-routing.module';

import { AltaActivoPage } from './alta-activo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaActivoPageRoutingModule
  ],
  declarations: [AltaActivoPage]
})
export class AltaActivoPageModule {}
