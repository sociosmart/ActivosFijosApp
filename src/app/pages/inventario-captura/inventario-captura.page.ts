import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inventario-captura',
  templateUrl: './inventario-captura.page.html',
  styleUrls: ['./inventario-captura.page.scss'],
})
export class InventarioCapturaPage implements OnInit {

  inventario: any;

  activos: any[] = [];
  noEncontrados: any[] = [];
  incidencias: any[] = [];

  escaneados = 0;

  // 🔍 imagen modal
  imagenSeleccionada: string | null = null;

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {

    const nav = this.router.getCurrentNavigation();
    this.inventario = nav?.extras?.state?.['inventario'];

    // 🔥 DATA SIMULADA
    this.activos = [
      {
        codigo: '123',
        nombre: 'Silla',
        encontrado: false,
        imagen: 'https://via.placeholder.com/80'
      },
      {
        codigo: '456',
        nombre: 'Mesa',
        encontrado: false,
        imagen: 'https://via.placeholder.com/80'
      },
      {
        codigo: '789',
        nombre: 'Laptop',
        encontrado: false,
        imagen: 'https://via.placeholder.com/80'
      }
    ];
  }

  // 🔍 SCAN
  iniciarScan() {
    const codigo = prompt('Simular escaneo:');
    if (!codigo) return;

    this.procesarCodigo(codigo.trim());
  }

  // 🔥 PROCESO
  async procesarCodigo(codigo: string) {

    const item = this.activos.find(a => a.codigo === codigo);

    if (item) {

      if (item.tieneIncidencia) {
        this.mostrarToast('⚠️ Este activo tiene incidencia', 'warning');
        return;
      }

      if (item.encontrado) {
        this.mostrarToast('⚠️ Ya escaneado', 'warning');
        return;
      }

      item.encontrado = true;
      this.escaneados++;

      this.mostrarToast('✔ Escaneado', 'success');

    } else {
      this.agregarNoEncontrado(codigo);
    }
  }

  // ❌ NO ENCONTRADO
  agregarNoEncontrado(codigo: string) {

    const existe = this.noEncontrados.find(n => n.codigo === codigo);

    if (existe) {
      this.mostrarToast('Ya agregado', 'warning');
      return;
    }

    this.noEncontrados.push({
      codigo,
      descripcion: '',
      cuenta: '',
      imagen: 'https://via.placeholder.com/80'
    });

    this.mostrarToast('No encontrado', 'danger');
  }

  eliminarNoEncontrado(index: number) {
    this.noEncontrados.splice(index, 1);
  }

  // 📸 INCIDENCIA
  reportarIncidencia(item: any) {

    const nota = prompt('Describe el problema:');
    if (!nota) return;

    const foto = 'https://via.placeholder.com/150';

    item.tieneIncidencia = true;
    item.encontrado = false;

    item.incidencia = {
      nota,
      foto
    };

    this.incidencias.push({
      codigo: item.codigo,
      nota,
      foto
    });

    this.mostrarToast('Incidencia guardada', 'warning');
  }

  // 🔁 QUITAR INCIDENCIA
  quitarIncidencia(item: any) {

    item.tieneIncidencia = false;
    item.incidencia = null;

    this.incidencias = this.incidencias.filter(i => i.codigo !== item.codigo);

    this.mostrarToast('Incidencia eliminada', 'medium');
  }

  // 🔍 MODAL IMAGEN
  verImagen(img: string) {
    this.imagenSeleccionada = img;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  // 🔔 TOAST
  async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      color,
      position: 'top'
    });
    await t.present();
  }

  // 💾 GUARDAR
  guardar() {
    const payload = {
      inventarioId: this.inventario?.id,
      activos: this.activos,
      incidencias: this.incidencias,
      noEncontrados: this.noEncontrados
    };

    console.log('🚀', payload);
  }
}