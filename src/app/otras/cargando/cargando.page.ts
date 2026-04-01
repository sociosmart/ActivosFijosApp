import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.page.html',
  styleUrls: ['./cargando.page.scss'],
})
export class CargandoPage implements OnInit {

  constructor(public modalCtrl: ModalController,public navCtrl: NavController) { }

  ngOnInit() {
    console.log('ionViewDidLoad CargandoPage');

  }
  Cancelar(){
    
    this.navCtrl.navigateRoot('/home');

  }

}
