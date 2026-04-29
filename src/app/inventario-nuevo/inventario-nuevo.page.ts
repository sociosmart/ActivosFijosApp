import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inventario-nuevo',
  templateUrl: './inventario-nuevo.page.html',
    styleUrls: ['./inventario-nuevo.page.scss'], 
})
export class InventarioNuevoPage {

  empresas = ['Empresa A', 'Empresa B'];
  cuentas = ['Cuenta 1', 'Cuenta 2'];

  form: any = {
    empresa: '',
    cuenta: '',
    nombre: '',
    fecha: '',
    detalle: ''
  };

  constructor(private modalCtrl: ModalController) {}
 

  cerrar() {
    this.modalCtrl.dismiss();
  }

 crear() {

  if (!this.form.nombre || !this.form.empresa) {
    return;
  }

  const nuevo = {
    id: new Date().getTime(),
    nombre: this.form.nombre,
    ubicacion: this.form.empresa,
    fecha: this.form.fecha || new Date().toISOString(),
    estatus: 'nuevo',
    detalle: this.form.detalle,
    cuenta: this.form.cuenta
  };

  this.modalCtrl.dismiss(nuevo);
}
}