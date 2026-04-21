import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-lista-activos',
  templateUrl: './lista-activos.page.html',
  styleUrls: ['./lista-activos.page.scss'],
})
export class ListaActivosPage implements OnInit {

  activos: any[] = [];
  imagenes: { [key: number]: SafeUrl } = {};

  imagenSeleccionada: SafeUrl | null = null;
  modalImagenAbierto = false;

  private apiUrl = 'http://172.16.64.120:8080/api_activos_v2/public/';

  // 🔥 PAGINACIÓN
  pagina = 1;
  limite = 10;
  cargando = false;
  hayMas = true;

  // 🔥 CONTROL DE DUPLICADOS
  private idsCargados = new Set<number>();

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.init();
  }

  // ================= INIT =================
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

  // ================= CARGAR ACTIVOS =================
  async cargarActivos(event?: any) {

    if (this.cargando || !this.hayMas) {
      event?.target?.complete();
      return;
    }

    this.cargando = true;

    this.http.get<any[]>(
      `${this.apiUrl}activos?pagina=${this.pagina}&limite=${this.limite}`
    ).subscribe({

      next: (res) => {

        const data = res || [];

        // 🔥 eliminar duplicados
        const nuevos = data.filter((a: any) => {
          if (this.idsCargados.has(a.id)) {
            return false;
          }
          this.idsCargados.add(a.id);
          return true;
        });

        // 🔥 si no hay nuevos datos reales
        if (nuevos.length === 0) {
          this.hayMas = false;
        }

        // 🔥 si vino menos de lo esperado, ya no hay más
        if (nuevos.length < this.limite) {
          this.hayMas = false;
        }

        this.activos = [...this.activos, ...nuevos];

        // cargar imágenes
        for (const activo of nuevos) {
          if (activo.id) {
            this.cargarImagen(activo.id);
          }
        }

        this.pagina++;

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
        event?.target?.complete();
      }

    });
  }

  // ================= INFINITE SCROLL =================
  async loadMore(event: any) {
    await this.cargarActivos(event);
  }

  // ================= IMAGEN =================
  cargarImagen(id: number) {

    this.http.get(`${this.apiUrl}activo/${id}/imagen`, {
      responseType: 'blob'
    }).subscribe({

      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imagenes[id] = this.sanitizer.bypassSecurityTrustUrl(url);
      },

      error: (err) => {
        console.error('ERROR IMAGEN:', id, err);
      }

    });
  }

  // ================= MODAL =================
  abrirImagen(img: SafeUrl) {
    this.imagenSeleccionada = img;
    this.modalImagenAbierto = true;
  }

  cerrarImagen() {
    this.modalImagenAbierto = false;
    this.imagenSeleccionada = null;
  }

  // ================= REFRESH =================
  async refrescar(event?: any) {

    this.pagina = 1;
    this.activos = [];
    this.idsCargados.clear();   // 🔥 clave para evitar duplicados
    this.hayMas = true;

    await this.cargarActivos(event);
  }

  // ================= TOAST =================
  private async showToast(msg: string, color: string) {
    const t = await this.toastController.create({
      message: msg,
      duration: 2500,
      color
    });
    t.present();
  }
}