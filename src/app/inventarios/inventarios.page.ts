import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.page.html',
  styleUrls: ['./inventarios.page.scss'],
})
export class InventariosPage implements OnInit {

  inventarios: any[] = [];
  

  constructor(private toast: ToastController,private router:Router) {}

  ngOnInit() {
    this.cargarInventarios();
  }

  // 🔥 Simulación (luego lo conectas a API)
  cargarInventarios() {
    this.inventarios = [
      {
        id: 1,
        nombre: 'Inventario Sucursal Norte',
        ubicacion: 'Los Mochis',
        fecha: '2026-04-27',
        estatus: 'nuevo' // nuevo | en_proceso | completado
      },
      {
        id: 2,
        nombre: 'Inventario Almacén',
        ubicacion: 'Culiacán',
        fecha: '2026-04-20',
        estatus: 'en_proceso'
      },
      {
        id: 3,
        nombre: 'Inventario General',
        ubicacion: 'Mazatlán',
        fecha: '2026-04-10',
        estatus: 'completado'
      }
    ];
  }

  // ================= ACCIONES =================

  accionInventario(inv: any) {
    if (inv.estatus === 'completado') {
      this.descargar(inv);
    } else {
      this.continuar(inv);
    }
  }

  descargar(inv: any) {
    this.showToast(`Descargando ${inv.nombre} 📥`, 'primary');
  }

  continuar(inv: any) {
    this.showToast(`Continuando ${inv.nombre} ▶️`, 'success');
  }

  nuevoInventario() {
    this.showToast('Crear nuevo inventario ➕', 'primary');
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
  this.router.navigate(['/inventario-detalle', inv.id]);
}
}