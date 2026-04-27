import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-activos',
  templateUrl: './lista-activos.page.html',
  styleUrls: ['./lista-activos.page.scss'],
})
export class ListaActivosPage implements OnInit {

  activos: any[] = [];
  imagenes: { [key: number]: string } = {};

  // 🔥 modal imagen
  imagenSeleccionada: string | null = null;
  modalImagenAbierto = false;

  private apiUrl = 'http://172.16.64.120:8080/api_activos_v2/public/';
  cargando = false;

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    try {
      const token = await this.auth.getToken();

      if (!token) {
        this.showToast('Sesión expirada ❌', 'danger');
        return;
      }

      await this.cargarActivos();

    } catch (err) {
      console.error(err);
      this.showToast('Error inicial ❌', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  // ================= CARGAR =================
  async cargarActivos(event?: any) {

    if (this.cargando) {
      this.completeEvent(event);
      return;
    }

    this.cargando = true;

    this.http.get<any[]>(`${this.apiUrl}activos`).subscribe({

      next: (res) => {

        this.activos = res || [];

        for (const activo of this.activos) {
          if (activo.id) {
            this.cargarImagen(activo.id);
          }
        }

      },

      error: (err) => {
        console.error(err);

        if (err.status === 401) {
          this.showToast('Sesión expirada ❌', 'danger');
        } else {
          this.showToast('Error al cargar activos ❌', 'danger');
        }
      },

      complete: () => {
        this.cargando = false;
        this.completeEvent(event);
      }

    });
  }

  async refrescarManual() {
    await this.cargarActivos();
  }

  async refrescar(event: any) {
    await this.cargarActivos(event);
  }

  private completeEvent(event: any) {
    if (event?.target && typeof event.target.complete === 'function') {
      event.target.complete();
    }
  }

  // ================= IMAGEN =================
  cargarImagen(id: number) {

    if (this.imagenes[id]) return;

    this.http.get(`${this.apiUrl}activo/${id}/imagen`, {
      responseType: 'blob'
    }).subscribe({

      next: (blob) => {
        this.imagenes[id] = URL.createObjectURL(blob);
      },

      error: (err) => {
        console.error('ERROR IMAGEN:', id, err);
      }

    });
  }

  // ================= MODAL =================
  abrirImagen(img: string) {
    this.imagenSeleccionada = img;
    this.modalImagenAbierto = true;
  }

  cerrarImagen() {
    this.modalImagenAbierto = false;
    this.imagenSeleccionada = null;
  }

  // ================= SCAN =================
  irEscaner() {
    this.router.navigate(['/scan-barcode']);
  }

  private async showToast(msg: string, color: string) {
    const t = await this.toastController.create({
      message: msg,
      duration: 2500,
      color
    });
    t.present();
  }
}