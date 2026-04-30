import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion-modal',
  templateUrl: './configuracion-modal.component.html',
  styleUrls: ['./configuracion-modal.component.scss'],
  standalone: true, // 🔥 importante
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class ConfiguracionModalComponent {

  @Input() config: any;

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    this.modalCtrl.dismiss(this.config);
  }
}