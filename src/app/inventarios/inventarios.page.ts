import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { InventarioNuevoPage } from '../inventario-nuevo/inventario-nuevo.page';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.page.html',
  styleUrls: ['./inventarios.page.scss'],
})
export class InventariosPage implements OnInit {

  inventarios: any[] = [];
  

  constructor(private toast: ToastController,private router:Router,private modalCtrl: ModalController ) {}

  ngOnInit() {
    this.cargarInventarios();
  }

  // 🔥 Simulación (luego lo conectas a API)
  cargarInventarios() {
  this.inventarios = [
    {
      id: 1,
      nombre: 'Inventario Sucursal Norte',
      empresa: 'Empresa A',
      cuenta: 'Cuenta 1',
      ubicacion: 'Los Mochis',
      fecha: new Date().toISOString(),
      estatus: 'nuevo',
      detalle: 'Inventario inicial'
    },
    {
      id: 2,
      nombre: 'Inventario Almacén',
      empresa: 'Empresa B',
      cuenta: 'Cuenta 2',
      ubicacion: 'Culiacán',
      fecha: new Date().toISOString(),
      estatus: 'en_proceso',
      detalle: 'Conteo parcial'
    }
  ];
}

  // ================= ACCIONES =================



  descargar(inv: any) {
    this.showToast(`Descargando ${inv.nombre} 📥`, 'primary');
  }

  continuar(inv: any) {
    this.showToast(`Continuando ${inv.nombre} ▶️`, 'success');
  }
async nuevoInventario() {

  const modal = await this.modalCtrl.create({
    component: InventarioNuevoPage,
    cssClass: 'modal-inventario' // 🔥 flotante
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();

  if (data) {
    this.inventarios.unshift(data); // 🔥 se actualiza la lista
    this.showToast('Inventario creado correctamente ✅', 'success');
  }
}

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({
      message: msg,
      duration: 2000,
      color
    });
    t.present();
  }
irDetalle(inv: any) {
  console.log(inv);
   this.router.navigate(['/inventario-detalle', inv.id], {
    state: { inventario: inv }
  });
}
  accionInventario(inv:any) {
  this.router.navigate(['/inventario-captura'], {
    state: { inventario: inv }
  });
}
}