
import { Component, OnInit } from '@angular/core';
import { ApirestService } from '../services/apirest.service';
import { Storage } from '@ionic/storage-angular'
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

// import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { DeviceInfo, DeviceId } from '@capacitor/device';

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
  
})
export class HostPage implements OnInit {
  
  users:any;
  uuid:any;
  plataforma:any;
  modelo:any;
  isPushed:any;
  estaciones:any;
  estaciones1:any;

api = environment.baseUrl;

  constructor(private storage: Storage,private navctrl:NavController) {
  }

  ngOnInit() {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HostPage');
    // this.uuid=this.device.
    // this.plataforma=this.device.platform;
    // this.modelo=this.device.model;
    this.uuid="65b206efd59d553b1";
    this.modelo="9013A";
    this.plataforma="ANDROID";
  }
  guardarcambio(){
    this.storage.create();
    this.storage.set('apisociosmart', this.api);
    this.navctrl.navigateRoot('/config');

  }

}