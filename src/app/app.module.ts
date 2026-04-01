import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';

import { GraphQLModule } from './graphql.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Printer } from '@awesome-cordova-plugins/printer/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@NgModule({
  declarations: [AppComponent], schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  imports: [BrowserModule, IonicModule.forRoot({innerHTMLTemplatesEnabled: true}), GraphQLModule,AppRoutingModule,HttpClientModule, IonicStorageModule.forRoot(),HammerModule  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Printer,
    BluetoothSerial,AndroidPermissions ],
  bootstrap: [AppComponent],
})
export class AppModule {}
