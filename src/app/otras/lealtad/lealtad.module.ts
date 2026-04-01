import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LealtadPageRoutingModule } from './lealtad-routing.module';

import { LealtadPage } from './lealtad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LealtadPageRoutingModule
  ],
  declarations: [LealtadPage]
})
export class LealtadPageModule {}
