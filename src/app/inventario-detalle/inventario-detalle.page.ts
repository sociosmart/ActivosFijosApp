import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventario-detalle',
  templateUrl: './inventario-detalle.page.html',
    styleUrls: ['./inventario-detalle.page.scss'],
})
export class InventarioDetallePage implements OnInit {

  inventario: any;

  // 🔥 IMPORTANTE: referencia al arreglo original
  inventarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    // 🟢 1. Intentar recibir desde state (cuando vienes desde la lista)
    const nav = this.router.getCurrentNavigation();
    const stateData = nav?.extras?.state as any;

    if (stateData?.inventario) {
      this.inventario = stateData.inventario;
      console.log('Desde state:', this.inventario);
      return;
    }

    // 🔴 2. Fallback (si recargan o entran directo por URL)
    const id = this.route.snapshot.paramMap.get('id');

    console.log('Buscar por ID:', id);

    // ⚠️ Aquí debes traer el arreglo real (temporalmente simulado)
    this.inventarios = history.state?.inventarios || [];

    this.inventario = this.inventarios.find(i => i.id == id);

    console.log('Desde fallback:', this.inventario);
  }

  guardar() {
    console.log('Guardado:', this.inventario);
    this.router.navigate(['/inventarios']);
  }

  
}