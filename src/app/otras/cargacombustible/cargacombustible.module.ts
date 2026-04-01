import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CargacombustiblePageRoutingModule } from './cargacombustible-routing.module';

import { CargacombustiblePage } from './cargacombustible.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CargacombustiblePageRoutingModule
  ],
  declarations: [CargacombustiblePage]
})
export class CargacombustiblePageModule {}
