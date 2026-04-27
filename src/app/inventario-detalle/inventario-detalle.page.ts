import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-inventario-detalle',
  templateUrl: './inventario-detalle.page.html',
})
export class InventarioDetallePage implements OnInit {

  inventario: any;
  activos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();

    const id = this.route.snapshot.paramMap.get('id');

    // 🔥 carga local (offline)
    const data = await this.storage.get(`inv_${id}`);

    if (data) {
      this.inventario = data.inventario;
      this.activos = data.activos || [];
    }
  }

  async guardarLocal() {
    await this.storage.set(`inv_${this.inventario.id}`, {
      inventario: this.inventario,
      activos: this.activos
    });
  }
}